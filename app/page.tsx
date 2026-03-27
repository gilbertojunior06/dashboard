"use client"

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Search, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Cpu
} from "lucide-react";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from 'recharts';

// Importando os dados simulados
import { COLORS, dataProducao, dataStatus, maquinas } from '../data/data';

// --- DEFINIÇÃO DE TIPOS (Para acabar com o erro de 'any') ---
interface Maquina {
  id: number | string;
  nome: string;
  consumo: string | number;
  status: 'normal' | 'alerta' | 'critico' | string;
}

interface StatusData {
  name: string;
  value: number;
}

// Função auxiliar para evitar erro de hidratação
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Home() {
  const isMounted = useIsClient();

  if (!isMounted) {
    return <div style={{ background: '#f8fafc', height: '100vh' }} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">
            <Activity size={24} color="#fff" />
          </div>
          <span>SENAI | Tech</span>
        </div>
        <nav className="nav-list">
          <Link href="/" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/maquina" className="nav-item">
            <Cpu size={20} />
            <span>Máquinas</span>
          </Link>

          <Link href="#" className="nav-item">
            <Users size={20} />
            <span>Equipe</span>
          </Link>
          
          <Link href="#" className="nav-item">
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-box">
            <Search size={18} color="#64748b" />
            <input type="text" placeholder="Procurar dados da linha..." />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Bell size={20} style={{ cursor: 'pointer', color: '#64748b' }} />
            <div className="user-profile">OP</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Painel de Controle</h1>
            <p style={{ color: '#64748b' }}>Monitorização da Linha de Montagem em Tempo Real</p>
          </div>

          {/* KPI Grid */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#dcfce7' }}>
                <CheckCircle2 color="#10b981" />
              </div>
              <div className="kpi-info">
                <p>OEE Global</p>
                <h3>94.2%</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#dbeafe' }}>
                <Activity color="#3b82f6" />
              </div>
              <div className="kpi-info">
                <p>Peças Hoje</p>
                <h3>1.240</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#fef3c7' }}>
                <AlertCircle color="#f59e0b" />
              </div>
              <div className="kpi-info">
                <p>Alertas</p>
                <h3>03</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="icon-wrapper" style={{ background: '#f3e8ff' }}>
                <Activity color="#8b5cf6" />
              </div>
              <div className="kpi-info">
                <p>Tempo de Ciclo</p>
                <h3>42s</h3>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Produção vs Meta (Semanal)</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataProducao}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Legend />
                    <Bar name="Produção" dataKey="prod" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name="Meta" dataKey="meta" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Status da Frota</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataStatus}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {/* TIPAGEM CORRIGIDA AQUI */}
                      {dataStatus.map((entry: StatusData, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela de Máquinas */}
          <div className="chart-card" style={{ marginTop: '20px' }}>
            <h3 className="chart-title">Monitoramento de Ativos</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px 8px' }}>ID</th>
                    <th style={{ padding: '12px 8px' }}>Máquina</th>
                    <th style={{ padding: '12px 8px' }}>Consumo (kWh)</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TIPAGEM CORRIGIDA AQUI */}
                  {maquinas.map((m: Maquina) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px' }}>#{m.id}</td>
                      <td style={{ padding: '12px 8px', fontWeight: '500' }}>{m.nome}</td>
                      <td style={{ padding: '12px 8px' }}>{m.consumo}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: m.status === 'normal' ? '#dcfce7' : m.status === 'alerta' ? '#fef3c7' : '#fee2e2',
                          color: m.status === 'normal' ? '#166534' : m.status === 'alerta' ? '#92400e' : '#991b1b'
                        }}>
                          {m.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}