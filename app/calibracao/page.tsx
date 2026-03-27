"use client";

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Zap, Power, AlertTriangle, 
  ChevronUp, ChevronDown, CircleDot
} from 'lucide-react';

// --- COMPONENTE DE BOTÃO INDUSTRIAL PREMIUM ---

const IndustrialButton = ({ Icon, label, isActive, onClick }: { 
  Icon: React.ElementType, 
  label: string, 
  isActive: boolean,
  onClick: () => void 
}) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-3 w-full group cursor-pointer active:translate-y-0.5 transition-all select-none"
  >
    {/* Estrutura do Botão Metálico com Relevo */}
    <div className="relative w-10 h-10 rounded-full border-[3px] border-[#94a3b8] bg-gradient-to-br from-[#475569] to-[#1e293b] shadow-[4px_4px_8px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center">
      {/* O LED central com efeito de brilho real */}
      <div className={`w-5 h-5 rounded-full border border-black/40 flex items-center justify-center transition-all duration-300 ${
        isActive 
        ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24,inset_0_0_4px_white]' 
        : 'bg-zinc-800 opacity-60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]'
      }`}>
        <Icon size={12} className={isActive ? 'text-amber-900' : 'text-zinc-500'} />
      </div>
    </div>
    <span className="text-[11px] font-black text-slate-900 uppercase leading-none tracking-tight drop-shadow-sm">
      {label}
    </span>
  </div>
);

const IndicatorLed = ({ color, label, active }: { color: string, label: string, active: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-full border border-black/40 transition-all duration-500 ${
      active 
      ? `${color} shadow-[0_0_10px_currentColor,inset_0_0_4px_rgba(255,255,255,0.5)]` 
      : 'bg-zinc-400 opacity-30'
    }`}></div>
    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">{label}</span>
  </div>
);

const DataBox = ({ label, value, unit }: { label: string, value: string, unit?: string }) => (
  <div className="border border-black/80 bg-white/90 p-2 flex flex-col items-center flex-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
    <span className="text-[11px] font-black uppercase text-slate-500 mb-1 border-b border-slate-200 w-full text-center pb-0.5">{label}</span>
    <div className="text-sm font-mono font-black text-black tracking-tight">
      {value} <span className="text-[16px] font-bold text-slate-500">{unit}</span>
    </div>
  </div>
);

// --- PAINEL DO ATUADOR ---

interface ActuatorProps {
  title: string;
  colorClass: string;
  accentColor: string;
  initialValues: { alvo: string; forcaD: string; velD: string; unitP: string; unitV: string; }
}

const ActuatorPanel = ({ title, colorClass, accentColor, initialValues }: ActuatorProps) => {
  const [btnLiga, setBtnLiga] = useState(false);
  const [btnHome, setBtnHome] = useState(false);
  const [btnStart, setBtnStart] = useState(false);
  const [btnReset, setBtnReset] = useState(false);
  const [posicao, setPosicao] = useState(0.00);

  return (
    <div className={`border-2 border-black ${colorClass} p-4 w-full max-w-[360px] flex flex-col gap-4 shadow-[10px_10px_20px_rgba(0,0,0,0.4)] relative overflow-hidden`}>
      {/* Brilho reflexivo no topo do painel */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      
      <h2 className={`border-2 border-black ${accentColor} text-center py-2 text-lg font-black text-black uppercase shadow-sm relative z-10`}>
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4 border border-black bg-black/5 p-3 backdrop-blur-[2px] rounded-sm">
        <div className="flex flex-col gap-4">
          <IndustrialButton Icon={Zap} label="Liga Servo" isActive={btnLiga} onClick={() => setBtnLiga(!btnLiga)} />
          <IndustrialButton Icon={Power} label="Servo Home" isActive={btnHome} onClick={() => { setBtnHome(true); setPosicao(0); setTimeout(() => setBtnHome(false), 500); }} />
          <IndustrialButton Icon={Power} label="Start" isActive={btnStart} onClick={() => setBtnStart(!btnStart)} />
          <IndustrialButton Icon={AlertTriangle} label="Reset Alarm" isActive={btnReset} onClick={() => { setBtnReset(true); setTimeout(() => setBtnReset(false), 800); }} />
        </div>
        
        <div className="flex flex-col gap-3 justify-center pl-3 border-l-2 border-black/20">
          <IndicatorLed color="bg-lime-400" label="Servo ON" active={btnLiga} />
          <IndicatorLed color="bg-lime-400" label="Home OK" active={posicao === 0} />
          <IndicatorLed color="bg-orange-500" label="Start Movimento" active={btnStart} />
          <IndicatorLed color="bg-red-600" label=" Servo em Alarme" active={btnReset} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 relative z-10">
        <DataBox label="Posição Alvo" value={initialValues.alvo} unit={initialValues.unitP} />
        <DataBox label="Posição Atual" value={posicao.toFixed(2)} unit={initialValues.unitP} />
        <DataBox label="Força Desejada" value={initialValues.forcaD} unit="%" />
        <DataBox label="Força Atual" value={btnLiga ? initialValues.forcaD : "0"} unit="%" />
        <DataBox label="Velocidade" value={initialValues.velD} unit={initialValues.unitV} />
        <DataBox label="Real" value={btnStart ? initialValues.velD : "0"} unit={initialValues.unitV} />
      </div>

      <div className="flex justify-around py-3 border-2 border-black bg-black/10 shadow-inner">
        <button 
          onMouseDown={() => btnLiga && setPosicao(p => p + 0.1)}
          className="flex flex-col items-center group"
        >
          <div className="bg-gradient-to-b from-white to-slate-200 p-3 rounded-full border-2 border-black shadow-[4px_4px_0px_black] group-active:translate-y-1 group-active:shadow-none transition-all">
            <ChevronUp size={24} className="text-black" />
          </div>
          <span className="text-[10px] font-black mt-2 uppercase text-black">JOG +</span>
        </button>
        <button 
          onMouseDown={() => btnLiga && setPosicao(p => p - 0.1)}
          className="flex flex-col items-center group"
        >
          <div className="bg-gradient-to-b from-white to-slate-200 p-3 rounded-full border-2 border-black shadow-[4px_4px_0px_black] group-active:translate-y-1 group-active:shadow-none transition-all">
            <ChevronDown size={24} className="text-black" />
          </div>
          <span className="text-[10px] font-black mt-2 uppercase text-black">JOG -</span>
        </button>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---

function useIsClient() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export default function ActuatorDashboard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#020617] p-8 font-sans flex flex-col items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
      <header className="w-full max-w-7xl mb-12 flex items-center justify-between border-b-2 border-slate-800 pb-6">
        <Link href="/" className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black uppercase text-xs tracking-widest group">
          <div className="bg-slate-800 p-2 rounded-full group-hover:bg-slate-700 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Voltar ao Sistema
        </Link>
        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700">
          <CircleDot size={16} className="text-lime-400 animate-pulse" />
          <span className="text-slate-200 font-black text-xs uppercase tracking-widest">Painel de Controle SENAI | Tech</span>
        </div>
      </header>

      <main className="w-full max-w-7xl flex flex-wrap justify-center gap-10">
        <ActuatorPanel 
          title="Atuador 300mm" colorClass="bg-[#0ea5e9]" accentColor="bg-[#0284c7]"
          initialValues={{ alvo: "150.00", forcaD: "50", velD: "150", unitP: "mm", unitV: "mm/s" }}
        />
        <ActuatorPanel 
          title="Atuador Rotativo" colorClass="bg-[#fb923c]" accentColor="bg-[#f97316]"
          initialValues={{ alvo: "90.00", forcaD: "50", velD: "20", unitP: "°", unitV: "°/s" }}
        />
        <ActuatorPanel 
          title="Atuador 100mm" colorClass="bg-[#10b981]" accentColor="bg-[#059669]"
          initialValues={{ alvo: "85.00", forcaD: "36", velD: "150", unitP: "mm", unitV: "mm/s" }}
        />
      </main>
      
      <footer className="mt-20 text-slate-600 font-bold text-[10px] uppercase tracking-[0.3em]">
        Sistema de Monitoramento Industrial v2.0
      </footer>
    </div>
  );
}