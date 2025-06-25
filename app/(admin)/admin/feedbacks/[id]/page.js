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
    const [feedback, setFeedback] = useState(null); // Estado separado para os dados originais

    const [formData, setFormData] = useState({
        ativo: '',
    });

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/feedbacks/${id}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar feedback: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados do feedback');
                }

                setFeedback(data); // Armazena os dados completos
                setFormData({
                    ativo: data.ativo?.toString() || '',
                });

                setError(null);
            } catch (err) {
                console.error('Erro ao carregar feedback:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFeedback();
        }
    }, [id]);

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

            if (!formData.ativo) {
                throw new Error('Selecione um status para o feedback');
            }

            const res = await fetch(`/api/admin/feedbacks/aprovar/${id}`, {
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
                throw new Error(data.error || 'Falha ao atualizar feedback');
            }

            setSuccess('Status do feedback atualizado com sucesso!');
            setTimeout(() => router.push('/admin/feedbacks'), 2000);
        } catch (error) {
            console.error('Erro na submissão:', error);
            setError(error.message || 'Erro ao atualizar status do feedback');
        } finally {
            setLoading(false);
        }
    };

     const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este feedback permanentemente?')) {
            return;
        }

        try {
            setDeleting(true);
            const res = await fetch(`/api/admin/feedbacks/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao excluir feedback');
            }

            setSuccess('Feedback excluído com sucesso!');
            setTimeout(() => router.push('/admin/feedbacks'), 2000);
        } catch (error) {
            console.error('Erro na exclusão:', error);
            setError(error.message || 'Erro ao excluir feedback');
        } finally {
            setDeleting(false);
        }
    };

    if (loading && !feedback) {
        return (
            <div className="admin-loading">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados do feedback...</p>
            </div>
        );
    }

    if (error && !feedback) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <Link href="/admin/feedbacks" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="error-container">
                <p>Feedback não encontrado</p>
                <Link href="/admin/feedbacks" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-lista-admin">
                <h1>Visualizar Feedback #{feedback.id_feedback}</h1>
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
                            src={feedback.receita?.img_receita || '/images/usuario/fotodoperfil.png'}
                            alt={feedback.receita?.titulo_receita || 'Foto da Receita'}
                            width={200}
                            height={200}
                            className="usuario-foto-perfil"
                        />
                        <h2>Receita: {feedback.receita?.titulo_receita}</h2>             
                        <p>Mensagem: {feedback.feedback || 'Nenhuma mensagem fornecida'}</p>                                   
                        <p>Data do feedback: {formatarDataeHora(feedback.data_cadastro)}</p>
                        <p>Feedback de: {feedback.usuario?.nome || 'Usuário Desconhecido'}</p>
                        <p>Email: {feedback.usuario?.email || 'Email Desconhecido'}</p>
                        <p>Status: {Status(feedback.ativo)}</p>
                    </div>

                    <div className="usuario-cadastro-botoes">
                       <Link href={`/admin/feedbacks/alterar/${feedback.id_feedback}`}><button type="button">Alterar</button></Link>
                        <Link href={`/admin/feedbacks/excluir/${feedback.id_feedback}`}><button type="button">Excluir</button></Link>
                        <Link href={'/admin/feedbacks/'} passHref><button type="button">Voltar</button></Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

