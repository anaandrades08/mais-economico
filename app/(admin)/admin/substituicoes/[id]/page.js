'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { formatarDataeHora, formatarData, Status } from '../../funcoes/Usuarios';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2  } from 'react-icons/fi';

export default function FeedbackAprovarAdmin() {
    const { id } = useParams(); // Mudança: usar desestruturação direta
    const router = useRouter();
    const [loading, setLoading] = useState(true);    
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [substituicao, setSubstituicao] = useState(null); // Estado separado para os dados originais

    const [formData, setFormData] = useState({
        ativo: '',
    });

    useEffect(() => {
        const fetSubstituicao = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/substituicoes/${id}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar substituicao: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados do substituicao');
                }

                setSubstituicao(data); // Armazena os dados completos
                setFormData({
                    ativo: data.ativo?.toString() || '',
                });

                setError(null);
            } catch (err) {
                console.error('Erro ao carregar substituicao:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetSubstituicao();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const limparFormulario = () => {
        setFormData({ ...substituicao });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            if (!formData.ativo) {
                throw new Error('Selecione um status para o substituicao');
            }

            const res = await fetch(`/api/admin/substituicoes/aprovar/${id}`, {
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
                throw new Error(data.error || 'Falha ao atualizar substituicao');
            }

            setSuccess('Status do substituicao atualizado com sucesso!');
            setTimeout(() => router.push('/admin/substituicoes'), 2000);
        } catch (error) {
            console.error('Erro na submissão:', error);
            setError(error.message || 'Erro ao atualizar status do substituicao');
        } finally {
            setLoading(false);
        }
    };

     const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este substituicao permanentemente?')) {
            return;
        }

        try {
            setDeleting(true);
            const res = await fetch(`/api/admin/substituicoes/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao excluir substituicao');
            }

            setSuccess('Feedback excluído com sucesso!');
            setTimeout(() => router.push('/admin/substituicoes'), 2000);
        } catch (error) {
            console.error('Erro na exclusão:', error);
            setError(error.message || 'Erro ao excluir substituicao');
        } finally {
            setDeleting(false);
        }
    };

    if (loading && !substituicao) {
        return (
            <div className="admin-loading">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados da substituição...</p>
            </div>
        );
    }

    if (error && !substituicao) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <Link href="/admin/substituicoes" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    if (!substituicao) {
        return (
            <div className="error-container">
                <p>Feedback não encontrado</p>
                <Link href="/admin/substituicoes" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-lista-admin">
                <h1>Visualizar Substituição #{substituicao.id_substituicao}</h1>
                 <button 
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="button-delete"
                                    >
                                        {deleting ? (
                                            <FiLoader className="spin" />
                                        ) : (
                                            <>
                                                <FiTrash2 /> Excluir
                                            </>
                                        )}
                                    </button>
                {/* Mensagens de substituicao */}
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
                            src={substituicao.receita?.img_receita || '/images/usuario/fotodoperfil.png'}
                            alt={substituicao.receita?.titulo_receita || 'Foto da Receita'}
                            width={200}
                            height={200}
                            className="usuario-foto-perfil"
                        />
                        <h2>Receita: {substituicao.receita?.titulo_receita}</h2>             
                        <p>Descrição: {substituicao.descricao_preparo || 'Nenhuma mensagem fornecida'}</p>                                   
                        <p>Data da Substituição: {formatarDataeHora(substituicao.data_cadastro)}</p>
                        <p>Enviado por: {substituicao.usuario?.nome || 'Usuário Desconhecido'}</p>
                        <p>Email: {substituicao.usuario?.email || 'Email Desconhecido'}</p>
                        <p>Status: {Status(substituicao.ativo)}</p>
                    </div>

                    <div className="usuario-cadastro-botoes">
                       <Link href={`/admin/substituicoes/alterar/${substituicao.id_substituicao}`}><button type="button">Alterar</button></Link>
                        <Link href={`/admin/substituicoes/excluir/${substituicao.id_substituicao}`}><button type="button">Excluir</button></Link>
                        <Link href={'/admin/substituicoes/'} passHref><button type="button">Voltar</button></Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

