"use client";

import React, { useState, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Zap, Power, AlertTriangle, 
  ChevronUp, ChevronDown, CircleDot
} from 'lucide-react';

// --- INTERFACES ---
interface ActuatorValues {
  alvo: string;
  forcaD: string;
  velD: string;
  unitP: string;
  unitV: string;
}

interface DataFieldProps {
  label: string;
  value: string | number;
  unit: string;
  isReal?: boolean;
  onChange?: (val: string) => void;
}

interface IndustrialButtonProps {
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isAlarm?: boolean;
}

interface ActuatorPanelProps {
  title: string;
  colorClass: string;
  accentColor: string;
  initialValues: ActuatorValues;
}

// --- COMPONENTES ---
const DataField = ({ label, value, onChange, unit, isReal }: DataFieldProps) => (
  <div className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all min-h-[65px] ${
    isReal ? 'bg-slate-100 border-slate-200 shadow-inner' : 'bg-white border-blue-200 shadow-sm focus-within:border-blue-400'
  }`}>
    <span className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-tighter leading-none">{label}</span>
    <div className="flex items-baseline gap-1">
      {isReal || !onChange ? (
        <span className="text-lg font-mono font-black text-blue-600 leading-none">{value}</span>
      ) : (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-16 text-center text-lg font-mono font-black text-slate-800 bg-transparent outline-none leading-none"
        />
      )}
      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">{unit}</span>
    </div>
  </div>
);

const IndustrialButton = ({ Icon, label, isActive, onClick, isAlarm = false }: IndustrialButtonProps) => (
  <div onClick={onClick} className="flex items-center gap-3 w-full group cursor-pointer active:translate-y-0.5 transition-all select-none">
    <div className={`relative w-10 h-10 min-w-[40px] rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
      isActive 
        ? (isAlarm ? 'border-red-500 bg-red-50 shadow-md' : 'border-blue-500 bg-blue-50 shadow-md') 
        : 'border-slate-300 bg-white shadow-sm'
    }`}>
      <Icon size={18} className={isActive ? (isAlarm ? 'text-red-600' : 'text-blue-600') : 'text-slate-400'} />
    </div>
    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight leading-none">{label}</span>
  </div>
);

const ActuatorPanel = ({ title, colorClass, accentColor, initialValues }: ActuatorPanelProps) => {
  const [vals, setVals] = useState<ActuatorValues>(initialValues);
  const [isServoOn, setIsServoOn] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(false);
  const [posicao, setPosicao] = useState(0.00);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // LÓGICA DE MOVIMENTO JOG
  const handleJog = (delta: number) => {
    if (!isServoOn || hasAlarm) return;
    setPosicao(prev => parseFloat((prev + delta).toFixed(2)));
    setIsMoving(true);
    setIsHome(false); // Saiu do Home se moveu
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsMoving(false), 300);
  };

  // LÓGICA DO BOTÃO HOME (CORRIGIDA)
  const handleHomeAction = () => {
    if (!isServoOn || hasAlarm) return;
    if (!isHome) {
      setPosicao(0);
      setIsHome(true);
      setIsMoving(false);
    } else {
      setIsHome(false); // Permite desligar o LED se clicar de novo
    }
  };

  // LÓGICA DO BOTÃO START
  const handleStartAction = () => {
    if (!isServoOn || hasAlarm) return;
    const nextMovingState = !isMoving;
    setIsMoving(nextMovingState);
    if (nextMovingState) setIsHome(false); // Desliga Home ao iniciar movimento
  };

  return (
    <div className="p-1 bg-slate-200 rounded-[22px] shadow-xl border border-white/50 h-fit">
      <div className={`${colorClass} p-5 w-[380px] min-h-[580px] rounded-[18px] border border-slate-300 flex flex-col gap-5 relative overflow-hidden`}>
        
        <h2 className={`${accentColor} text-center py-3 text-lg font-black text-white uppercase tracking-tighter rounded-xl shadow-lg italic border-b-4 border-black/10`}>
          {title}
        </h2>

        <div className="flex gap-4 bg-white/40 px-8 py-5 rounded-2xl border border-white shadow-inner min-h-[190px]">
          <div className="flex flex-col gap-3 flex-1 justify-between">
            <IndustrialButton Icon={Zap} label="Servo On" isActive={isServoOn} onClick={() => !hasAlarm && setIsServoOn(!isServoOn)} />
            <IndustrialButton Icon={CircleDot} label="Home" isActive={isHome} onClick={handleHomeAction} />
            <IndustrialButton Icon={Power} label="Start" isActive={isMoving} onClick={handleStartAction} />
            <IndustrialButton Icon={AlertTriangle} label="Reset" isActive={hasAlarm} onClick={() => setHasAlarm(!hasAlarm)} isAlarm />
          </div>
          
          <div className="flex flex-col gap-5 justify-center min-w-[120px]">
            {[ 
              { label: 'SERVO ON', active: isServoOn, color: 'bg-emerald-400' },
              { label: 'HOME OK', active: isHome, color: 'bg-emerald-500' },
              { label: 'SERVO EM MOVIMENTO', active: isMoving, color: 'bg-blue-400 animate-pulse' },
              { label: 'SERVO EM ALARME', active: hasAlarm, color: 'bg-red-500' }
            ].map((led) => (
              <div key={led.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border-4 border-white shadow-md transition-all duration-300 ${led.active ? `${led.color} shadow-[0_0_20px_rgba(255,255,255,0.7)]` : 'bg-slate-300'}`} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter leading-none whitespace-nowrap">{led.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-white/30 p-2 rounded-xl border border-white/50 shadow-inner">
            <DataField label="Set Alvo" value={vals.alvo} onChange={(v) => setVals({...vals, alvo: v})} unit={vals.unitP} />
            <DataField label="Pos. Real" value={posicao.toFixed(2)} isReal unit={vals.unitP} />
            <DataField label="Set Força" value={vals.forcaD} onChange={(v) => setVals({...vals, forcaD: v})} unit="%" />
            <DataField label="Torque" value={isMoving ? vals.forcaD : (isServoOn ? "5" : "0")} isReal unit="%" />
            <DataField label="Set Velo." value={vals.velD} onChange={(v) => setVals({...vals, velD: v})} unit={vals.unitV} />
            <DataField label="Velo. Real" value={isMoving ? vals.velD : "0"} isReal unit={vals.unitV} />
        </div>

        <div className="flex justify-around py-4 bg-slate-300/30 rounded-2xl border border-white shadow-inner mt-auto">
          <button onMouseDown={() => handleJog(0.1)} className="flex flex-col items-center gap-1 active:scale-90 transition-all">
            <div className="bg-white p-2 rounded-xl border border-slate-300 shadow-sm"><ChevronUp size={24} className="text-slate-600" /></div>
            <span className="text-[9px] font-black text-slate-500 uppercase leading-none">JOG +</span>
          </button>
          <button onMouseDown={() => handleJog(-0.1)} className="flex flex-col items-center gap-1 active:scale-90 transition-all">
            <div className="bg-white p-2 rounded-xl border border-slate-300 shadow-sm"><ChevronDown size={24} className="text-slate-600" /></div>
            <span className="text-[9px] font-black text-slate-500 uppercase leading-none">JOG -</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const emptySubscribe = () => () => {};

export default function ActuatorDashboard() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) return <div className="min-h-screen bg-slate-50" />; 

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center font-sans">
      <header className="w-full max-w-7xl mb-8 flex justify-between items-center border-b border-slate-200 pb-4">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-widest leading-none">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-slate-500 font-black text-[10px] uppercase tracking-wider leading-none">SENAI | TECH HUB</span>
        </div>
      </header>

      <main className="flex flex-wrap justify-center gap-8 w-full">
        <ActuatorPanel 
          title="Atuador Eletrico 300 mm" colorClass="bg-blue-50/50" accentColor="bg-blue-600" 
          initialValues={{ alvo: "150.0", forcaD: "50", velD: "100", unitP: "mm", unitV: "mm/s" }} 
        />
        <ActuatorPanel 
          title="Atuador Rotativo" colorClass="bg-slate-100" accentColor="bg-slate-700" 
          initialValues={{ alvo: "90.0", forcaD: "40", velD: "30", unitP: "°", unitV: "°/s" }} 
        />
        <ActuatorPanel 
          title="Atuador Eletrico 100 mm" colorClass="bg-emerald-50/50" accentColor="bg-emerald-600" 
          initialValues={{ alvo: "10.0", forcaD: "80", velD: "120", unitP: "mm", unitV: "mm/s" }} 
        />
      </main>
    </div>
  );
}