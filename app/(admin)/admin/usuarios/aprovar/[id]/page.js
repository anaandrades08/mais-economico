'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { formatarDataeHora, formatarData } from '../../../funcoes/Usuarios';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function UsuarioAprovarAdmin() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',
        ativo: '',
        data_cadastro: '',
        img_usuario: '/images/usuario/fotodoperfil.png',
    });

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/usuarios/admin/${params.id}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar usuário: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados do usuário');
                }

                // Preenche o formulário com os dados do usuário
                setFormData({
                    nome: data.nome || '',
                    tipo: data.tipo?.toString(),
                    ativo: data.ativo?.toString(),
                    data_cadastro: formatarDataeHora(data.data_cadastro) || '',
                });

                setError(null);
            } catch (err) {
                console.error('Erro ao carregar usuário:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchUsuario();
        }
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const limparFormulario = () => {
        setFormData({ ...usuario });
    };
  const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            // Validate form data
            if (!formData.ativo) {
                throw new Error('Selecione um status para o usuário');
            }

            const res = await fetch(`/api/usuarios/aprovar/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ativo: parseInt(formData.ativo)
                })
            });

            const data = await res.json();
            
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao atualizar usuário');
            }

            setSuccess('Status do usuário atualizado com sucesso!');
            setTimeout(() => router.push('/admin/usuarios'), 2000);
        } catch (error) {
            console.error('Erro na submissão:', error);
            setError(error.message || 'Erro ao atualizar status do usuário');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.nome) {
        return (
            <div className="admin-loading">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados do usuário para aprovar...</p>
            </div>
        );
    }

    if (error && !formData.nome) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <Link href="/admin/usuarios" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Aprovar Usuário - {formData.nome}</h1>                
                <p>Cadastrado em: {formData.data_cadastro}</p>
                {/* Mensagens de feedback */}
                        {error && (
                          <div className="status-message error">
                            <FiAlertCircle className="icon" />
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="close-btn">
                              &times;
                            </button>
                          </div>
                        )}
                
                        {success && (
                          <div className="status-message success">
                            <FiCheckCircle className="icon" />
                            <span>{success}</span>
                          </div>
                        )}
                <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
                    <div className="usuario-cadastro-inputs">
                        <Image
                            src={formData.img_usuario || '/images/usuario/fotodoperfil.png'}
                            alt={formData.nome}
                            width={100}
                            height={100}
                            className="usuario-foto-perfil"
                        />

                        <p>Para aprovar o usuário mude o status para ativo:</p>
                        <select name="ativo" value={formData.ativo} onChange={handleChange}>
                            <option value=''>Selecione</option>
                            <option value='1'>Aprovar</option>
                            <option value='2'>Reprovar</option>
                            <option value='0'>Inativo</option>
                        </select>
                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spin" /> Aprovando...
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle /> Aprovar usuário
                                </>
                            )}
                        </button>

                        <Link href={'/admin/usuarios/'} passHref><button type="button">Cancelar</button></Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

