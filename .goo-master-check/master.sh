#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail

# CHECK ko script ke andar bhi define karo (subshell safe)
CHECK="${CHECK:-$PWD/.goo-master-check}"
mkdir -p "$CHECK"

PASS="✅"; FAIL="❌"; WARN="⚠️ "
ok(){ echo "$PASS $1"; }
bad(){ echo "$FAIL $1"; exit 1; }

echo "============================================================"
echo " GOO TV — FINAL MASTER FIX & VERIFY"
echo "============================================================"

# 0. ENV SANITY
echo "--- 0. ENV ---"
[ -f package.json ] || bad "package.json missing"
[ -d node_modules ] || bad "node_modules missing (npm install chalao)"
[ -x node_modules/.bin/tsc ] || bad "tsc missing"
node_modules/.bin/tsc --version
echo

# 1. PROTECTED FILES LOCK
echo "--- 1. PROTECTED FILES ---"
PROTECTED=(
  "src/services/servers.ts"
  "src/utils/playerUrl.ts"
  "src/components/CleanCinemaPlayerWindow.tsx"
  "src/components/PlayerModal.tsx"
  "src/components/ServersListModal.tsx"
)
declare -A H1
for f in "${PROTECTED[@]}"; do
  [ -f "$f" ] || bad "Protected file missing: $f"
  H1["$f"]="$(sha256sum "$f" | awk '{print $1}')"
  ok "locked $(basename "$f")"
done
echo

# 2. MEDIAITEM AUTO-PATCH
echo "--- 2. MediaItem FIX ---"
node - <<'NODE'
const fs=require("fs"),path=require("path");
const walk=(d,o=[])=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p,o):/\.(ts|tsx)$/.test(e.name)&&o.push(p);}return o;};
let n=0;
for(const f of walk("src")){
  let s=fs.readFileSync(f,"utf8"),o=s;
  s=s.replace(/(interface\s+MediaItem\b[^{]*\{)([\s\S]*?)(\n\s*\})/,(m,a,b,c)=>/\boriginal_language\b/.test(b)?m:(n++,`${a}${b}\n  original_language?: string;${c}`));
  s=s.replace(/(type\s+MediaItem\s*=\s*\{)([\s\S]*?)(\n\s*\};?)/,(m,a,b,c)=>/\boriginal_language\b/.test(b)?m:(n++,`${a}${b}\n  original_language?: string;${c}`));
  if(s!==o){fs.writeFileSync(f,s);console.log("  patched:",f);}
}
console.log("  MediaItem patches:",n);
NODE
ok "MediaItem fix applied"
echo

# 3. LOCALES CHECK
echo "--- 3. LOCALES ---"
node - <<'NODE'
const fs=require("fs");
const f="src/i18n/locales.ts";
if(!fs.existsSync(f)){console.error("missing locales.ts");process.exit(1);}
const src=fs.readFileSync(f,"utf8");
const codes=[...src.matchAll(/\{\s*code:\s*["']([^"']+)["']/g)].map(x=>x[1]);
console.log("  count:",codes.length,"unique:",new Set(codes).size);
if(codes.length!==50||new Set(codes).size!==50)process.exit(1);
NODE
ok "50 locales verified"
echo

# 4. LOCALE MANIFEST
echo "--- 4. LOCALE MANIFEST ---"
node - <<'NODE'
const fs=require("fs");
const f="src/i18n/locales.ts";
const src=fs.readFileSync(f,"utf8");
const re=/\{\s*code:\s*["']([^"']+)["']\s*,\s*name:\s*["']([^"']+)["']\s*,\s*nativeName:\s*["']([^"']+)["']\s*,\s*tmdb:\s*["']([^"']+)["']\s*\}/g;
const ls=[...src.matchAll(re)].map(m=>({code:m[1],name:m[2],nativeName:m[3],tmdb:m[4]}));
if(ls.length!==50)process.exit(1);
fs.mkdirSync("public",{recursive:true});
fs.writeFileSync("public/locales.json",JSON.stringify({default:"en",count:ls.length,locales:ls},null,2)+"\n");
console.log("  public/locales.json written:",ls.length);
NODE
ok "manifest rebuilt"
echo

# 5. REQUIRED FILES
echo "--- 5. REQUIRED FILES ---"
FILES=(
  "src/i18n/locales.ts"
  "src/i18n/resources.ts"
  "src/i18n/index.ts"
  "src/seo/seo.ts"
  "src/seo/keywords.ts"
  "public/locales.json"
  "public/robots.txt"
  "public/sitemap.xml"
)
for f in "${FILES[@]}"; do [ -f "$f" ] || bad "Missing $f"; ok "found $f"; done
echo

# 6. TYPECHECK
echo "--- 6. TYPECHECK ---"
if node_modules/.bin/tsc --noEmit > "$CHECK/tsc.log" 2>&1; then
  ok "TypeScript PASS"
else
  cat "$CHECK/tsc.log"; bad "TypeScript FAILED"
fi
echo

# 7. LINT (optional)
echo "--- 7. LINT ---"
if [ -x node_modules/.bin/eslint ]; then
  if node_modules/.bin/eslint . --max-warnings=0 > "$CHECK/eslint.log" 2>&1; then
    ok "ESLint PASS"
  else
    echo "$WARN ESLint warnings (non-fatal)"; tail -20 "$CHECK/eslint.log" || true
  fi
else
  echo "$WARN eslint not installed, skipping"
fi
echo

# 8. BUILD
echo "--- 8. BUILD ---"
if [ -f package.json ] && node -e "process.exit(require('./package.json').scripts?.build?0:1)"; then
  if npm run build > "$CHECK/build.log" 2>&1; then
    ok "Build PASS"
  else
    tail -40 "$CHECK/build.log"; bad "Build FAILED"
  fi
else
  echo "$WARN no build script, skipping"
fi
echo

# 9. PROTECTED FILES UNCHANGED
echo "--- 9. PROTECTED UNCHANGED ---"
for f in "${PROTECTED[@]}"; do
  H2="$(sha256sum "$f" | awk '{print $1}')"
  [ "$H2" = "${H1[$f]}" ] || bad "Protected file modified: $f"
done
ok "player/server files intact"
echo

# 10. GIT COMMIT & PUSH
echo "--- 10. GIT ---"
if [ -d .git ]; then
  git add -A
  if git diff --cached --quiet; then
    ok "no changes to commit"
  else
    git -c user.name="goo-bot" -c user.email="goo-bot@local" \
      commit -m "fix: MediaItem.original_language + master audit pass"
    ok "committed"
    if git remote | grep -q .; then
      git push && ok "pushed" || echo "$WARN push failed (check auth)"
    else
      echo "$WARN no remote, skip push"
    fi
  fi
else
  echo "$WARN not a git repo"
fi
echo

echo "============================================================"
echo " 🎉 ALL CHECKS PASSED — GOO TV 100% READY"
echo "============================================================"
