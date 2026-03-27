'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Power, Play, Settings2, 
  AlertTriangle, CheckCircle2, RefreshCw 
} from "lucide-react";

export default function CalibracaoPage() {
  const [horaAtual, setHoraAtual] = useState('');
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isSleep, setIsSleep] = useState(false);
  const [activePgm, setActivePgm] = useState<number | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const clock = setInterval(() => setHoraAtual(new Date().toLocaleTimeString('pt-BR')), 1000);
    return () => clearInterval(clock);
  }, []);

  const handleEmergency = () => {
    if (!isEmergency) {
      setIsPowerOn(false);
      setIsHome(false);
      setIsSleep(false);
      setActivePgm(null);
    }
    setIsEmergency(!isEmergency);
  };

  const styles = {
    container: {
      backgroundColor: '#facc15',
      minHeight: '100vh',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column' as const,
      fontFamily: 'sans-serif',
    },
    mainPanel: {
      backgroundColor: '#0369a1',
      flex: 1,
      borderRadius: '8px',
      border: '4px solid #075985',
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: '20px',
    },
    pushButton: (active: boolean, color: string) => ({
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      cursor: isEmergency ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.1s ease',
      position: 'relative' as const,
      border: '6px solid #475569',
      backgroundColor: active ? color : '#334155',
      boxShadow: active 
        ? `inset 0 4px 10px rgba(0,0,0,0.5), 0 0 20px ${color}80` 
        : `0 8px 0 #1e293b, 0 12px 20px rgba(0,0,0,0.4)`,
      transform: active ? 'translateY(6px)' : 'translateY(0)',
      opacity: isEmergency ? 0.6 : 1,
    }),
    emergencyBtn: {
      width: '85px',
      height: '85px',
      borderRadius: '50%',
      backgroundColor: '#b91c1c',
      border: '6px solid #450a0a',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isEmergency 
        ? 'inset 0 6px 10px rgba(0,0,0,0.8)' 
        : '0 8px 0 #7f1d1d, 0 10px 20px rgba(0,0,0,0.4)',
      transform: isEmergency ? 'translateY(6px)' : 'translateY(0)',
      transition: '0.1s',
      marginTop: '10px',
    },
    led: (color: string, active: boolean) => ({
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      backgroundColor: active ? color : '#1e293b',
      border: '3px solid #334155',
      boxShadow: active ? `0 0 20px ${color}, inset 0 0 10px rgba(255,255,255,0.5)` : 'none',
      transition: '0.3s',
    })
  };

  return (
    <div style={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#1e293b', color: 'white', marginBottom: '5px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/" style={{ color: 'white' }}><ArrowLeft size={24} /></Link>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px' }}>ID DO EQUIPAMENTO</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>ROBOT-LB12</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '12px', color: '#94a3b8' }}>MODELO: <span style={{ color: 'white' }}>Fanuc M-1iA</span></div>
           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#facc15' }}>{horaAtual}</div>
        </div>
      </header>

      <div style={styles.mainPanel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0284c7', border: '3px solid #facc15', padding: '25px 15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <button 
                onMouseDown={() => { if(isPowerOn && !isEmergency) { setIsHome(true); setIsSleep(false); setActivePgm(null); } }}
                onMouseUp={() => setIsHome(false)}
                style={styles.pushButton(isHome, '#3b82f6')}
              ></button>
              <p style={{ color: 'white', fontWeight: 'bold', marginTop: '15px', fontSize: '13px' }}>HOME</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onMouseDown={() => { if(isPowerOn && !isEmergency) { setIsSleep(true); setIsHome(false); setActivePgm(null); } }}
                onMouseUp={() => setIsSleep(false)}
                style={styles.pushButton(isSleep, '#ef4444')}
              ></button>
              <p style={{ color: 'white', fontWeight: 'bold', marginTop: '15px', fontSize: '13px' }}>SLEEP</p>
            </div>
          </div>

          <div style={{ background: '#0284c7', border: '3px solid #facc15', padding: '20px', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
              <button 
                onClick={() => !isEmergency && setIsPowerOn(!isPowerOn)} 
                style={{ ...styles.pushButton(isPowerOn, '#22c55e'), width: '50px', height: '50px' }}
              >
                <Power color="white" size={20} />
              </button>
              <span style={{ color: 'white', fontWeight: 'bold' }}>SISTEMA {isPowerOn ? 'ON' : 'OFF'}</span>
            </div>

            {['CALL PGM 1', 'CALL PGM 2', 'CALL PGM 3'].map((pgm, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', opacity: (isPowerOn && !isEmergency) ? 1 : 0.5 }}>
                <button 
                  onClick={() => isPowerOn && !isEmergency && setActivePgm(i)}
                  style={{ ...styles.pushButton(activePgm === i, '#facc15'), width: '45px', height: '45px' }}
                >
                  <Play size={16} fill="white" />
                </button>
                <span style={{ color: 'white', fontSize: '12px' }}>{pgm}</span>
              </div>
            ))}

            <div style={{ borderTop: '2px solid #075985', paddingTop: '15px', marginTop: '10px', textAlign: 'center' }}>
              <button onClick={handleEmergency} style={styles.emergencyBtn}>
                <AlertTriangle color="white" size={32} />
              </button>
              <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '8px', fontSize: '12px' }}>EMERGÊNCIA</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateRows: '1fr 140px', gap: '20px' }}>
          <div style={{ background: '#0c4a6e', borderRadius: '10px', border: '3px solid #0ea5e9', display: 'flex', padding: '20px', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {[
                { label: 'Running', color: '#ef4444', active: isPowerOn && !isEmergency },
                { label: 'Sleep', color: '#f59e0b', active: isSleep },
                { label: 'Home', color: '#f59e0b', active: isHome },
                { label: 'PGM 1', color: '#22c55e', active: activePgm === 0 },
                { label: 'PGM 2', color: '#22c55e', active: activePgm === 1 },
                { label: 'PGM 3', color: '#22c55e', active: activePgm === 2 },
                { label: 'E-STOP', color: '#b91c1c', active: isEmergency },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={styles.led(item.color, item.active)}></div>
                  <span style={{ color: 'white', fontSize: '12px' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', position: 'relative', overflow: 'hidden', border: '4px solid #facc15' }}>
              <Image 
                src="https://www.fanucamerica.com/images/default-source/robotics/robots/lrmate200id_7l_large.jpg" 
                alt="Fanuc Robot" fill style={{ objectFit: 'contain', padding: '20px', filter: isEmergency ? 'grayscale(100%)' : 'none' }} unoptimized
              />
              {isEmergency && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(185, 28, 28, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: '#b91c1c', color: 'white', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', border: '2px solid white' }}>EMERGÊNCIA ATIVA</div>
                </div>
              )}
            </div>
          </div>

          {/* AQUI ESTÃO OS SEUS LABELS QUE EU TINHA ESQUECIDO! */}
          <div style={{ background: '#1e293b', borderRadius: '10px', padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { label: 'STATUS', value: isEmergency ? 'PARADA' : (isPowerOn ? 'READY' : 'OFF'), icon: <CheckCircle2 size={12} color="#22c55e"/> },
              { label: 'TEMP.', value: isPowerOn ? '36°C' : '22°C', icon: <RefreshCw size={12} color="#3b82f6"/> },
              { label: 'CARGA', value: activePgm !== null ? '1.2kg' : '0.0kg', icon: <Settings2 size={12} color="#94a3b8"/> },
              { label: 'OEE', value: '94%', icon: <CheckCircle2 size={12} color="#facc15"/> },
              { label: 'MODELO', value: 'M-1iA', icon: <Settings2 size={12} color="#94a3b8"/> },
              { label: 'MODO', value: 'REMOTO', icon: <Settings2 size={12} color="#94a3b8"/> },
              { label: 'MANUT.', value: '17/03', icon: <RefreshCw size={12} color="#94a3b8"/> },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#0f172a', padding: '8px', borderRadius: '6px', border: '1px solid #334155' }}>
                <div style={{ color: '#94a3b8', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {stat.icon} {stat.label}
                </div>
                <div style={{ color: (stat.label === 'STATUS' && isEmergency) ? '#ef4444' : 'white', fontSize: '15px', fontWeight: 'bold', marginTop: '3px' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}