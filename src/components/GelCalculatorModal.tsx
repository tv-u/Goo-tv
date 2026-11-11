import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { playGelPop } from '../utils/gelSound';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GelCalculatorModal: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [resetNext, setResetNext] = useState(false);

  if (!isOpen) return null;

  const handleNum = (num: string) => {
    playGelPop('med');
    if (display === '0' || resetNext) {
      setDisplay(num);
      setResetNext(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    playGelPop('high');
    setEquation(`${display} ${op} `);
    setResetNext(true);
  };

  const handleEqual = () => {
    playGelPop('high');
    try {
      const full = `${equation}${display}`;
      // Safe numeric eval
      const sanitized = full.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(4))));
      setEquation('');
      setResetNext(true);
    } catch {
      setDisplay('Error');
      setResetNext(true);
    }
  };

  const handleClear = () => {
    playGelPop('low');
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xs liquid-glass-plate rounded-[40px] p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/40">
          <span className="text-xs font-bold text-stone-800 tracking-wider uppercase">Gel Calculator</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full gel-cream flex items-center justify-center cursor-pointer active:scale-90"
          >
            <div className="gel-sheen" />
            <X className="w-3.5 h-3.5 text-stone-900" />
          </button>
        </div>

        {/* Display Screen (Translucent Frosted Capsule) */}
        <div className="rounded-2xl bg-white/50 border border-white/80 p-3 mb-4 shadow-inner text-right">
          <div className="text-[10px] text-stone-500 font-mono h-4">{equation}</div>
          <div className="text-2xl font-black text-stone-900 font-mono tracking-tight truncate">{display}</div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <button onClick={handleClear} className="h-11 rounded-full gel-cream flex items-center justify-center text-xs font-black text-rose-700 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            AC
          </button>
          <button onClick={() => setDisplay(String(-Number(display)))} className="h-11 rounded-full gel-cream flex items-center justify-center text-xs font-bold text-stone-800 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            ±
          </button>
          <button onClick={() => handleOp('%')} className="h-11 rounded-full gel-cream flex items-center justify-center text-xs font-bold text-stone-800 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            %
          </button>
          <button onClick={() => handleOp('÷')} className="h-11 rounded-full gel-pink flex items-center justify-center text-sm font-black text-stone-950 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            ÷
          </button>

          {['7', '8', '9'].map(n => (
            <button key={n} onClick={() => handleNum(n)} className="h-11 rounded-full gel-cream flex items-center justify-center text-sm font-bold text-stone-900 active:scale-95 cursor-pointer">
              <div className="gel-sheen" />
              {n}
            </button>
          ))}
          <button onClick={() => handleOp('×')} className="h-11 rounded-full gel-pink flex items-center justify-center text-sm font-black text-stone-950 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            ×
          </button>

          {['4', '5', '6'].map(n => (
            <button key={n} onClick={() => handleNum(n)} className="h-11 rounded-full gel-cream flex items-center justify-center text-sm font-bold text-stone-900 active:scale-95 cursor-pointer">
              <div className="gel-sheen" />
              {n}
            </button>
          ))}
          <button onClick={() => handleOp('-')} className="h-11 rounded-full gel-pink flex items-center justify-center text-sm font-black text-stone-950 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            −
          </button>

          {['1', '2', '3'].map(n => (
            <button key={n} onClick={() => handleNum(n)} className="h-11 rounded-full gel-cream flex items-center justify-center text-sm font-bold text-stone-900 active:scale-95 cursor-pointer">
              <div className="gel-sheen" />
              {n}
            </button>
          ))}
          <button onClick={() => handleOp('+')} className="h-11 rounded-full gel-pink flex items-center justify-center text-sm font-black text-stone-950 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            +
          </button>

          <button onClick={() => handleNum('0')} className="col-span-2 h-11 rounded-full gel-cream flex items-center justify-center text-sm font-bold text-stone-900 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            0
          </button>
          <button onClick={() => handleNum('.')} className="h-11 rounded-full gel-cream flex items-center justify-center text-sm font-bold text-stone-900 active:scale-95 cursor-pointer">
            <div className="gel-sheen" />
            .
          </button>
          <button onClick={handleEqual} className="h-11 rounded-full gel-pink flex items-center justify-center text-sm font-black text-stone-950 active:scale-95 cursor-pointer shadow-md">
            <div className="gel-sheen" />
            =
          </button>
        </div>
      </div>
    </div>
  );
};
