"use client"

import { useState } from 'react';
import Link from 'next/link';
import { 
    Activity, 
    Settings, 
    Trash2, 
    Plus, 
    Save, 
    ArrowLeft, 
    Cpu, 
    BarChart3 
} from "lucide-react";

// Estilização reutilizando o padrão do seu projeto
import '@/app/cadastro.css'; 

export default function MaquinasPage() {
    /* 1. Estados: Formulário e Lista Simulada */
    const [formData, setFormData] = useState({
        id: null as number | null,
        nome: '',
        status: 'Operando',
        eficiencia: ''
    });

    const [listMaquinas, setListMaquinas] = useState([
        { id: 1, nome: 'Torno CNC G-01', status: 'Operando', eficiencia: '95' },
        { id: 2, nome: 'Fresadora XP', status: 'Manutenção', eficiencia: '40' },
        { id: 3, nome: 'Braço Robótico A3', status: 'Parado', eficiencia: '0' }
    ]);

    /* 2. Cores por Status (Mantendo a identidade visual) */
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Operando': return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
            case 'Manutenção': return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
            case 'Parado': return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
            default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
        }
    };

    /* 3. Lógica do Formulário */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nome || !formData.eficiencia) {
            alert("Preencha o nome e a eficiência!");
            return;
        }

        if (formData.id) {
            // EDITAR
            setListMaquinas(listMaquinas.map(m => m.id === formData.id ? { ...formData, id: m.id } : m));
            alert('Dados da máquina atualizados!');
        } else {
            // CRIAR NOVO
            const novaMaquina = { ...formData, id: Date.now() };
            setListMaquinas([novaMaquina, ...listMaquinas]);
            alert('Máquina cadastrada com sucesso!');
        }

        // Reset
        setFormData({ id: null, nome: '', status: 'Operando', eficiencia: '' });
    };

    /* 4. Ações */
    const handleEdit = (maquina: any) => {
        setFormData(maquina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        if (confirm("Deseja remover esta máquina do sistema?")) {
            setListMaquinas(listMaquinas.filter(m => m.id !== id));
        }
    };

    return (
        <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
            
            <main className="cadastro-wrapper">
                
                {/* BOTÃO VOLTAR */}
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                        <ArrowLeft size={18} />
                        Voltar para SENAI | Dashboard
                    </Link>
                </div>

                {/* CARD DE CADASTRO / EDIÇÃO */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div className="logo-box" style={{ backgroundColor: '#2563eb', padding: '8px', borderRadius: '8px' }}>
                            <Activity size={24} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {formData.id ? 'Editar Máquina' : 'Cadastrar Novo Ativo'}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label><Cpu size={14} style={{marginRight: 4}}/> Nome do Ativo</label>
                                <input 
                                    type="text" 
                                    name="nome" 
                                    value={formData.nome} 
                                    onChange={handleChange} 
                                    placeholder="Ex: Torno CNC" 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label><Settings size={14} style={{marginRight: 4}}/> Status de Operação</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Operando">Operando</option>
                                    <option value="Manutenção">Manutenção</option>
                                    <option value="Parado">Parado</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><BarChart3 size={14} style={{marginRight: 4}}/> Eficiência (%)</label>
                                <input 
                                    type="number" 
                                    name="eficiencia" 
                                    value={formData.eficiencia} 
                                    onChange={handleChange} 
                                    placeholder="0 a 100" 
                                    max="100"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn-submit">
                                <Save size={20} />
                                {formData.id ? 'Salvar Alterações' : 'Registrar Máquina'}
                            </button>
                            {formData.id && (
                                <button 
                                    type="button" 
                                    onClick={() => setFormData({ id: null, nome: '', status: 'Operando', eficiencia: '' })}
                                    style={{ marginTop: '30px', background: '#e2e8f0', color: '#475569', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABELA DE MÁQUINAS */}
                <div className="table-container">
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Ativos da Planta</h3>
                        <span style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px' }}>
                            {listMaquinas.length} máquinas
                        </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th>Nome da Máquina</th>
                                    <th>Status</th>
                                    <th>Eficiência</th>
                                    <th style={{ textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listMaquinas.map((m) => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>#{m.id}</td>
                                        <td style={{ fontWeight: 600, color: '#1e293b' }}>{m.nome}</td>
                                        <td>
                                            <span className="badge-setor" style={getStatusStyle(m.status)}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td style={{ color: '#1e293b', fontWeight: '500' }}>{m.eficiencia}%</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                                <button onClick={() => handleEdit(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar">
                                                    <Settings size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Excluir">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {listMaquinas.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                <p>Nenhuma máquina encontrada no sistema.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}