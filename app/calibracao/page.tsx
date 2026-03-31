"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Zap, Power, AlertTriangle, 
  ChevronUp, ChevronDown, CircleDot, ChevronDown as ChevronIcon
} from 'lucide-react';

// --- DICIONÁRIO DE TRADUÇÃO ---
const translations = {
  PT: {
    back: "Voltar",
    title: "SISTEMA DE MONITORAMENTO INTEGRADO",
    servo: "Servo On",
    home: "Home",
    start: "Start",
    reset: "Reset",
    target: "Set Alvo",
    pos: "Pos. Real",
    force: "Set Força",
    torque: "Torque",
    velo: "Set Velo.",
    veloReal: "Velo. Real",
    moving: "Movendo",
    alarm: "Alarme",
    act300: "Atuador Eletrico 300mm",
    actRot: "Atuador Rotativo",
    act100: "Atuador Eletrico 100mm"
  },
  EN: {
    back: "Back",
    title: "INTEGRATED MONITORING SYSTEM",
    servo: "Servo On",
    home: "Home",
    start: "Start",
    reset: "Reset",
    target: "Set Target",
    pos: "Actual Pos.",
    force: "Set Force",
    torque: "Torque",
    velo: "Set Speed",
    veloReal: "Actual Speed",
    moving: "Moving",
    alarm: "Alarm",
    act300: "Electric Actuator 300mm",
    actRot: "Rotary Actuator",
    act100: "Electric Actuator 100mm"
  }
};

interface TranslationType {
  back: string; title: string; servo: string; home: string; start: string;
  reset: string; target: string; pos: string; force: string; torque: string;
  velo: string; veloReal: string; moving: string; alarm: string;
  act300: string; actRot: string; act100: string;
}

interface ActuatorValues {
  alvo: string; forcaD: string; velD: string; unitP: string; unitV: string;
}

interface ActuatorPanelProps {
  title: string; themeClass: string; accentColor: string;
  initialValues: ActuatorValues; t: TranslationType;
}

const DataField = ({ label, value, unit, isReal }: { label: string; value: string | number; unit: string; isReal?: boolean }) => (
  <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all min-h-[60px] ${
    isReal ? 'bg-black/10 border-black/10 shadow-inner' : 'bg-white/90 border-slate-300 shadow-sm'
  }`}>
    <span className="text-[8px] font-black uppercase text-slate-500 mb-0.5 tracking-tighter">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-base font-mono font-black text-slate-900">{value}</span>
      <span className="text-[8px] font-bold text-slate-500 uppercase">{unit}</span>
    </div>
  </div>
);

// AJUSTE NOS BOTÕES: Adicionei "pl-2" para eles não colarem na borda esquerda
const IndustrialButton = ({ Icon, label, isActive, onClick, isAlarm = false }: { Icon: React.ElementType; label: string; isActive: boolean; onClick: () => void; isAlarm?: boolean }) => (
  <div onClick={onClick} className="flex items-center gap-2 w-full group cursor-pointer active:scale-95 transition-all select-none pl-2">
    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
      isActive 
        ? (isAlarm ? 'border-red-600 bg-red-500 shadow-lg' : 'border-blue-600 bg-blue-500 shadow-lg') 
        : 'border-slate-400 bg-white/40'
    }`}>
      <Icon size={14} className={isActive ? 'text-white' : 'text-slate-600'} />
    </div>
    <span className="text-[9px] font-black text-slate-700 uppercase tracking-tight leading-none">{label}</span>
  </div>
);

const ActuatorPanel = ({ title, themeClass, accentColor, initialValues, t }: ActuatorPanelProps) => {
  const [vals] = useState<ActuatorValues>(initialValues);
  const [isServoOn, setIsServoOn] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(false);
  const [posicao, setPosicao] = useState(0.00);

  return (
    <div className="p-1.5 bg-slate-800 rounded-[22px] shadow-xl border-b-4 border-black/40">
      <div className={`${themeClass} p-4 w-[320px] lg:w-[350px] min-h-[520px] rounded-[18px] border border-white/20 flex flex-col gap-4 relative overflow-hidden`}>
        <h2 className={`${accentColor} text-center py-2 text-base font-black text-white uppercase tracking-tighter rounded-xl shadow-md italic border-b-4 border-black/20`}>
          {title}
        </h2>
        
        {/* ************************************************************************** */}
        {/* LINHA 90: ABAIXO ESTÁ O pl-6 (afasta os botões da borda) e o gap-[70px] */}
        {/* ************************************************************************** */}
        <div className="flex bg-white/20 backdrop-blur-sm pl-6 pr-4 py-4 rounded-2xl border border-white/30 shadow-inner justify-start gap-[110px]">
          
          <div className="flex flex-col gap-3">
            <IndustrialButton Icon={Zap} label={t.servo} isActive={isServoOn} onClick={() => setIsServoOn(!isServoOn)} />
            <IndustrialButton Icon={CircleDot} label={t.home} isActive={isHome} onClick={() => setIsHome(!isHome)} />
            <IndustrialButton Icon={Power} label={t.start} isActive={isMoving} onClick={() => setIsMoving(!isMoving)} />
            <IndustrialButton Icon={AlertTriangle} label={t.reset} isActive={hasAlarm} onClick={() => setHasAlarm(!hasAlarm)} isAlarm />
          </div>

          <div className="flex flex-col gap-4 justify-center">
            {[ 
              { label: 'SERVO ON', active: isServoOn, color: 'bg-emerald-400' },
              { label: 'HOME OK', active: isHome, color: 'bg-emerald-500' },
              { label: t.moving, active: isMoving, color: 'bg-blue-400 animate-pulse' },
              { label: t.alarm, active: hasAlarm, color: 'bg-red-500' }
            ].map((led) => (
              <div key={led.label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-sm transition-all ${led.active ? `${led.color} shadow-[0_0_10px_white]` : 'bg-slate-500/50'}`} />
                <span className="text-[7px] font-black text-slate-800 uppercase">{led.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-black/5 p-2 rounded-xl shadow-inner">
            <DataField label={t.target} value={vals.alvo} unit={vals.unitP} />
            <DataField label={t.pos} value={posicao.toFixed(2)} isReal unit={vals.unitP} />
            <DataField label={t.force} value={vals.forcaD} unit="%" />
            <DataField label={t.torque} value={isMoving ? vals.forcaD : "0"} isReal unit="%" />
            <DataField label={t.velo} value={vals.velD} unit={vals.unitV} />
            <DataField label={t.veloReal} value={isMoving ? vals.velD : "0"} isReal unit={vals.unitV} />
        </div>

        <div className="flex justify-around py-3 bg-black/10 rounded-2xl border border-white/20 mt-auto">
          <button onClick={() => setPosicao(p => p + 0.1)} className="flex flex-col items-center gap-1 active:scale-90 transition-all">
            <div className="bg-white/90 p-2 rounded-lg shadow-md"><ChevronUp size={20} className="text-slate-800" /></div>
            <span className="text-[8px] font-black text-slate-800 uppercase">JOG +</span>
          </button>
          <button onClick={() => setPosicao(p => p - 0.1)} className="flex flex-col items-center gap-1 active:scale-90 transition-all">
            <div className="bg-white/90 p-2 rounded-lg shadow-md"><ChevronDown size={20} className="text-slate-800" /></div>
            <span className="text-[8px] font-black text-slate-800 uppercase">JOG -</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ActuatorDashboard() {
  const [time, setTime] = useState("");
  const [lang, setLang] = useState<'PT' | 'EN'>('PT');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden font-sans">
      <header className="w-full bg-[#f6be00] p-4 shrink-0">
        <div className="bg-[#1a2332] flex items-center justify-between px-6 py-2 rounded-lg shadow-xl relative border border-white/5">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 bg-[#2d3748] hover:bg-[#3d485d] text-white px-3 py-1.5 rounded-md border border-white/10 text-[11px] font-bold uppercase transition-all shadow-sm">
              <ArrowLeft size={14} /> {t.back}
            </Link>
            <div className="flex items-center ml-2">
              <Image src="/senai.png" alt="SENAI" width={90} height={28} className="brightness-125 object-contain" />
            </div>
            <h1 className="text-white font-bold text-xs tracking-wide uppercase">{t.title}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center justify-between w-20 bg-[#1a2332] border ${dropdownOpen ? 'border-blue-500' : 'border-white/20'} px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-all select-none`}>
                <span className="text-white font-bold text-sm uppercase">{lang}</span>
                <ChevronIcon size={14} className={`text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-20 bg-[#1a2332] border border-white/10 rounded-md overflow-hidden z-50 shadow-2xl">
                  <div onClick={() => { setLang('PT'); setDropdownOpen(false); }} className={`px-3 py-2 text-sm font-bold text-white cursor-pointer hover:bg-blue-600 ${lang === 'PT' ? 'bg-blue-600' : ''}`}>PT</div>
                  <div onClick={() => { setLang('EN'); setDropdownOpen(false); }} className={`px-3 py-2 text-sm font-bold text-white cursor-pointer hover:bg-blue-600 ${lang === 'EN' ? 'bg-blue-600' : ''}`}>EN</div>
                </div>
              )}
            </div>
            <span className="text-[#f6be00] font-black text-xl font-mono tracking-widest min-w-[100px] text-right">{time}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-wrap items-center justify-center gap-6 p-4 overflow-y-auto bg-slate-100 content-center">
        <ActuatorPanel t={t} title={t.act300} themeClass="bg-gradient-to-br from-blue-400 to-blue-200" accentColor="bg-blue-700" initialValues={{ alvo: "150.0", forcaD: "50", velD: "100", unitP: "mm", unitV: "mm/s" }} />
        <ActuatorPanel t={t} title={t.actRot} themeClass="bg-gradient-to-br from-slate-500 to-slate-300" accentColor="bg-slate-800" initialValues={{ alvo: "90.0", forcaD: "40", velD: "30", unitP: "°", unitV: "°/s" }} />
        <ActuatorPanel t={t} title={t.act100} themeClass="bg-gradient-to-br from-emerald-400 to-emerald-200" accentColor="bg-emerald-700" initialValues={{ alvo: "10.0", forcaD: "80", velD: "120", unitP: "mm", unitV: "mm/s" }} />
      </main>

      <footer className="w-full bg-[#f6be00] p-2 shrink-0">
        <div className="bg-white/90 py-2 flex flex-col items-center justify-center rounded-md">
           <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">@{new Date().getFullYear()} — PROFº PAULO ROBERTO</p>
        </div>
      </footer>
    </div>
  );
}