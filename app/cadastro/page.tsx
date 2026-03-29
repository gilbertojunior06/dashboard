"use client"
import { Save, Users, Briefcase, Mail, MapPin, ArrowLeft, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import '@/app/cadastro.css'; 

export default function Cadastro() {
    /* 1. Estados: Formulário e Lista */
    const [formData, setFormData] = useState({
        id: null as number | null, // Controla se é um novo cadastro ou edição
        nome: '',
        email: '',
        cargo: '',
        setor: 'Produção' 
    });

    const [listFuncionarios, setListFuncionarios] = useState([
        { id: 1, nome: 'Maria Silva', email: 'maria@empresa.com', cargo: 'Operadora', setor: 'Produção' }
    ]);

    /* 2. Cores por Setor (Mantendo seu padrão) */
    const getSetorStyle = (setor: string) => {
        switch (setor) {
            case 'Produção': return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
            case 'Manutenção': return { background: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a' };
            case 'Logística': return { background: '#e0f2fe', color: '#075985', border: '1px solid #bae6fd' };
            case 'Qualidade': return { background: '#fce7f3', color: '#9d174d', border: '1px solid #fbcfe8' };
            default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
        }
    };

    /* 3. Lógica do Formulário (Salvar / Alterar) */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nome || !formData.email) {
            alert("Preencha ao menos o Nome e E-mail!");
            return;
        }

        if (formData.id) {
            // MODO EDIÇÃO: Atualiza o funcionário existente
            setListFuncionarios(listFuncionarios.map(f => f.id === formData.id ? { ...formData, id: f.id } : f));
            alert('Cadastro atualizado com sucesso!');
        } else {
            // MODO NOVO: Cria um novo ID e adiciona na lista
            const novoFuncionario = { ...formData, id: Date.now() };
            setListFuncionarios([novoFuncionario, ...listFuncionarios]);
            alert('Funcionário registrado com sucesso!');
        }

        // Limpa tudo após a ação
        setFormData({ id: null, nome: '', email: '', cargo: '', setor: 'Produção' });
    };

    /* 4. Funções de Ação na Tabela */
    const handleEdit = (funcionario: any) => {
        setFormData(funcionario); // Carrega os dados no formulário
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela para facilitar
    };

    const handleDelete = (id: number) => {
        if (confirm("Deseja realmente excluir este colaborador do sistema?")) {
            setListFuncionarios(listFuncionarios.filter(f => f.id !== id));
        }
    };

    return (
        <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
            <main className="cadastro-wrapper">
                
                {/* BOTÃO VOLTAR */}
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                        <ArrowLeft size={18} />
                        Voltar para SENAI | teach
                    </Link>
                </div>

                {/* CARD DE CADASTRO */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Users size={32} color="#2563eb" />
                        <h2>{formData.id ? 'Alterar Cadastro' : 'Cadastro de Funcionários'}</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label><Users size={14} style={{marginRight: 4}}/> Nome Completo</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex.: Gilberto Junior" />
                            </div>
                            <div className="form-group">
                                <label><Mail size={14} style={{marginRight: 4}}/> E-mail Corporativo</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemplo@empresa.com" />
                            </div>
                            <div className="form-group">
                                <label><Briefcase size={14} style={{marginRight: 4}}/> Cargo</label>
                                <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Ex.: Operador de Robô" />
                            </div>
                            <div className="form-group">
                                <label><MapPin size={14} style={{marginRight: 4}}/> Setor</label>
                                <select name="setor" value={formData.setor} onChange={handleChange}>
                                    <option value="Produção">Produção</option>
                                    <option value="Manutenção">Manutenção</option>
                                    <option value="Logística">Logística</option>
                                    <option value="Qualidade">Qualidade</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn-submit">
                                <Save size={20} />
                                {formData.id ? 'Salvar Alteração' : 'Salvar Registro'}
                            </button>
                            {formData.id && (
                                <button 
                                    type="button" 
                                    onClick={() => setFormData({ id: null, nome: '', email: '', cargo: '', setor: 'Produção' })}
                                    style={{ marginTop: '30px', background: '#e2e8f0', color: '#475569', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABELA ORIGINAL COM NOVAS AÇÕES */}
                <div className="table-container">
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Equipe Registrada</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Colaborador</th>
                                    <th>E-mail</th>
                                    <th>Função</th>
                                    <th>Departamento</th>
                                    <th style={{ textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listFuncionarios.map((f) => (
                                    <tr key={f.id}>
                                        <td style={{ fontWeight: 600, color: '#1e293b' }}>{f.nome}</td>
                                        <td style={{ color: '#64748b', fontSize: '13px' }}>{f.email}</td>
                                        <td style={{ color: '#64748b' }}>{f.cargo}</td>
                                        <td>
                                            <span className="badge-setor" style={getSetorStyle(f.setor)}>
                                                {f.setor}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                {/* Botão Alterar */}
                                                <button onClick={() => handleEdit(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar">
                                                    <Edit3 size={18} />
                                                </button>
                                                {/* Botão Excluir */}
                                                <button onClick={() => handleDelete(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Excluir">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}