'use client';

import React, { useState, useEffect, CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Power, Play, 
  AlertTriangle, Video, Settings2, Check
} from "lucide-react";

// --- DICIONÁRIO DE TRADUÇÃO ---
type Language = 'PT' | 'EN';

const translations = {
  PT: {
    back: "Voltar", model: "MODELO", system: "SISTEMA", emergency: "EMERGÊNCIA",
    running: "Executando", sleep: "Repouso", home: "Início", estop: "PARADA E.",
    status: "STATUS", temp: "TEMP.", load: "CARGA", oee: "OEE", mode: "MODO",
    maint: "MANUT.", alert: "ALERTA", ready: "LIGADO", off: "DESLIGADO",
    stop: "PARADA", remote: "REMOTO", normal: "NORMAL", 
    sysTitle: "SISTEMA DE MONITORAMENTO INTEGRADO",
    camReal: "CÂMERA REAL", camSim: "SIMULADOR"
  },
  EN: {
    back: "Back", model: "MODEL", system: "SYSTEM", emergency: "EMERGENCY",
    running: "Running", sleep: "Sleep", home: "Home", estop: "E-STOP",
    status: "STATUS", temp: "TEMP.", load: "LOAD", oee: "OEE", mode: "MODE",
    maint: "MAINT.", alert: "ALERT", ready: "READY", off: "OFF",
    stop: "STOPPED", remote: "REMOTE", normal: "NORMAL",
    sysTitle: "INTEGRATED MONITORING SYSTEM",
    camReal: "REAL CAMERA", camSim: "SIMULATOR"
  }
};

export default function CalibracaoPage() {
  const [lang, setLang] = useState<Language>('PT');
  const t = translations[lang];

  const [horaAtual, setHoraAtual] = useState('--:--:--');
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isSleep, setIsSleep] = useState(false);
  const [activePgm, setActivePgm] = useState<number | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const [isRealCam, setIsRealCam] = useState(false);
  const [cameraIp, setCameraIp] = useState('192.168.1.15:8080/video'); 
  const [tempIp, setTempIp] = useState('192.168.1.15:8080/video');
  const [showIpInput, setShowIpInput] = useState(false);

  // --- CORREÇÃO DO ERRO DO ESLINT ---
  // Não precisamos de useState para o ano, calculamos direto na constante.
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    const clock = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    
    return () => clearInterval(clock);
  }, []);

  const handleEmergency = () => {
    if (!isEmergency) {
      setIsPowerOn(false); setIsHome(false); setIsSleep(false); setActivePgm(null);
    }
    setIsEmergency(!isEmergency);
  };

  const styles = {
    container: { backgroundColor: '#facc15', height: '100vh', width: '100vw', padding: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box', fontFamily: 'sans-serif' } as CSSProperties,
    mainPanel: { backgroundColor: '#0369a1', flex: 1, borderRadius: '8px', border: '4px solid #075985', padding: '12px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '10px', overflow: 'hidden' } as CSSProperties,
    pushButton: (active: boolean, activeColor: string): CSSProperties => ({
      width: '52px', height: '52px', borderRadius: '50%', cursor: isEmergency ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s ease',
      border: '4px solid #475569', backgroundColor: active ? activeColor : '#334155',
      boxShadow: active ? `inset 0 3px 8px rgba(0,0,0,0.5), 0 0 15px ${activeColor}80` : `0 5px 0 #1e293b, 0 8px 12px rgba(0,0,0,0.4)`,
      transform: active ? 'translateY(3px)' : 'translateY(0)', opacity: isEmergency ? 0.6 : 1, outline: 'none',
    }),
    led: (color: string, active: boolean): CSSProperties => ({
      width: '24px', height: '24px', borderRadius: '50%', backgroundColor: active ? color : '#1e293b',
      border: '2px solid #334155', boxShadow: active ? `0 0 15px ${color}` : 'none', transition: '0.3s',
    })
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px', background: '#1e293b', color: 'white', marginBottom: '8px', borderRadius: '8px', border: '1px solid #334155', height: '65px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ 
            color: 'white', textDecoration: 'none', background: '#334155', padding: '8px 12px', borderRadius: '6px', 
            fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' 
          }}>
            <ArrowLeft size={16} /> <span>{t.back}</span>
          </Link>
          <Image src="/senai.png" alt="SENAI" width={150} height={38} unoptimized />
          <div style={{ height: '25px', width: '2px', background: '#ef4444' }}></div>
          <span style={{ fontSize: '14px', fontWeight: '800' }}>{t.sysTitle}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#0f172a', padding: '6px 12px', borderRadius: '12px', border: '1px solid #475569' }}>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)} 
              style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <option value="PT" style={{ background: '#0f172a', color: 'white' }}>PT</option>
              <option value="EN" style={{ background: '#0f172a', color: 'white' }}>EN</option>
            </select>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#facc15', fontFamily: 'monospace' }}>{horaAtual}</div>
        </div>
      </header>

      <div style={styles.mainPanel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#0284c7', border: '3px solid #facc15', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => isPowerOn && !isEmergency && setIsHome(!isHome)} style={styles.pushButton(isHome, '#3b82f6')}></button>
              <p style={{ color: 'white', fontWeight: 'bold', marginTop: '6px', fontSize: '10px' }}>{t.home.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => isPowerOn && !isEmergency && setIsSleep(!isSleep)} style={styles.pushButton(isSleep, '#3b82f6')}></button>
              <p style={{ color: 'white', fontWeight: 'bold', marginTop: '6px', fontSize: '10px' }}>{t.sleep.toUpperCase()}</p>
            </div>
          </div>

          <div style={{ background: '#0284c7', border: '3px solid #facc15', padding: '15px', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => !isEmergency && setIsPowerOn(!isPowerOn)} style={styles.pushButton(isPowerOn, '#22c55e')}><Power color="white" size={18} /></button>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>{t.system} {isPowerOn ? 'ON' : 'OFF'}</span>
            </div>
            
            {[0, 1, 2].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => isPowerOn && !isEmergency && setActivePgm(activePgm === i ? null : i)} style={styles.pushButton(activePgm === i, '#facc15')}><Play size={14} fill="white" /></button>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>CALL PGM {i + 1}</span>
              </div>
            ))}

            <div style={{ borderTop: '2px solid #075985', paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button 
                onClick={handleEmergency} 
                style={{ 
                  width: '85px', height: '85px', borderRadius: '50%', backgroundColor: '#b91c1c', 
                  border: '6px solid #450a0a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isEmergency ? 'inset 0 5px 10px black' : '0 6px 0 #7f1d1d', outline: 'none', padding: 0
                }}
              >
                <AlertTriangle color="white" size={40} />
              </button>
              <span style={{ color: '#ef4444', fontWeight: '950', marginTop: '10px', fontSize: '12px' }}>{t.emergency}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateRows: '1fr 125px', gap: '12px' }}>
          <div style={{ background: '#0c4a6e', borderRadius: '12px', border: '3px solid #0ea5e9', display: 'grid', gridTemplateColumns: '150px 1fr 1fr', padding: '15px', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {[{l: t.running, c: '#ef4444', a: isPowerOn && !isEmergency}, {l: t.sleep, c: '#3b82f6', a: isSleep}, {l: t.home, c: '#3b82f6', a: isHome}, {l: 'PGM 1', c: '#22c55e', a: activePgm === 0}, {l: 'PGM 2', c: '#22c55e', a: activePgm === 1}, {l: 'PGM 3', c: '#22c55e', a: activePgm === 2}, {l: t.estop, c: '#b91c1c', a: isEmergency}].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={styles.led(item.c, item.a)}></div>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{item.l}</span>
                </div>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <Image src="/Fanuc.png" alt="Robot" fill style={{ objectFit: 'contain', filter: isEmergency ? 'grayscale(100%)' : 'none' }} unoptimized />
            </div>
            <div style={{ background: '#000', borderRadius: '10px', border: '2px solid #334155', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 30, display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowIpInput(!showIpInput)} style={{ background: '#334155', border: '1px solid #facc15', color: '#facc15', padding: '8px', borderRadius: '8px' }}><Settings2 size={18} /></button>
                <button onClick={() => setIsRealCam(!isRealCam)} style={{ background: isRealCam ? '#ef4444' : '#1e293b', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>{isRealCam ? t.camSim : t.camReal}</button>
              </div>
              {showIpInput && (
                <div style={{ position: 'absolute', top: '55px', right: '10px', zIndex: 40, background: 'rgba(15, 23, 42, 0.95)', padding: '12px', borderRadius: '10px', border: '2px solid #facc15', display: 'flex', gap: '8px' }}>
                  <input type="text" value={tempIp} onChange={(e) => setTempIp(e.target.value)} style={{ background: '#1e293b', color: '#facc15', fontSize: '16px', padding: '8px', borderRadius: '6px', width: '200px', fontWeight: 'bold', outline: 'none' }} />
                  <button onClick={() => {setCameraIp(tempIp); setShowIpInput(false);}} style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px' }}><Check size={22} strokeWidth={3} /></button>
                </div>
              )}
              {(isPowerOn && !isEmergency) ? (
                isRealCam ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`http://${cameraIp}`} alt="Feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}><source src="/feed.mp4" type="video/mp4" /></video>
              ) : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={48} color="#1e293b" /></div>}
            </div>
          </div>

          <div style={{ background: '#1e293b', borderRadius: '10px', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', border: '2px solid #334155' }}>
            {[
              {l: t.status, v: isEmergency ? t.stop : (isPowerOn ? t.ready : t.off), c: isEmergency ? '#ef4444' : (isPowerOn ? '#22c55e' : '#ef4444')},
              {l: t.temp, v: isPowerOn ? '36.5°C' : '22.0°C'}, {l: t.load, v: activePgm !== null ? '1.2kg' : '0.0kg'}, {l: t.oee, v: '94%'},
              {l: t.model, v: 'LR Mate'}, {l: t.mode, v: t.remote}, {l: t.maint, v: '17/03'}, {l: t.alert, v: isEmergency ? t.estop : t.normal, c: isEmergency ? '#ef4444' : '#94a3b8'}
            ].map((s, i) => (
              <div key={i} style={{ background: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ color: '#94a3b8', fontSize: '9px', fontWeight: 'bold' }}>{s.l}</div>
                <div style={{ color: s.c || 'white', fontSize: '13px', fontWeight: 'bold' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '5px 0', fontSize: '15px', color: '#075985', fontWeight: 'bold' }}>
        @{anoAtual} Profº Paulo Roberto 
      </footer>
    </div>
  );
}