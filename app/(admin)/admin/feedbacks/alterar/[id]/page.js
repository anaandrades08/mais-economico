'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { formatarDataeHora } from '../../../funcoes/Usuarios';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function FeedbackEditarAdmin() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [formData, setFormData] = useState({
        feedback: '',
        ativo: '',
    });

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/feedbacks/${id}?complete=true`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar feedback: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados do feedback');
                }

                setFeedback(data);
                setFormData({
                    feedback: data.feedback || '',
                    ativo: data.ativo?.toString() || '',
                    observacao_admin: data.observacao_admin || ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setUpdating(true);

            if (!formData.ativo) {
                throw new Error('Selecione um status para o feedback');
            }

            const res = await fetch(`/api/admin/feedbacks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedback: formData.feedback,
                    ativo: parseInt(formData.ativo),
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao atualizar feedback');
            }

            setSuccess('Feedback atualizado com sucesso!');
            setTimeout(() => router.push('/admin/feedbacks'), 2000);
        } catch (error) {
            console.error('Erro na atualização:', error);
            setError(error.message || 'Erro ao atualizar feedback');
        } finally {
            setUpdating(false);
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
                <div className="header-with-actions">
                    <h1>Editar Feedback #{feedback.id_feedback}</h1>
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
                </div>

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
                            src={feedback.receita?.img_receita || '/images/default-recipe.png'}
                            alt={feedback.receita?.titulo_receita || 'Foto da Receita'}
                            width={300}
                            height={200}
                            className="feedback-image"
                        />
                        <h3>{feedback.receita?.titulo_receita || 'Receita sem título'}</h3>
                        <p className="feedback-meta">
                            <strong>Data:</strong> {formatarDataeHora(feedback.data_cadastro)}
                        </p>
                        <p className="feedback-meta">
                            <strong>Usuário:</strong> {feedback.usuario?.nome || 'Usuário Desconhecido'}
                        </p>
                    </div>

                    <div className="usuario-cadastro-inputs">
                        <div className="form-group">
                            <label htmlFor="feedback">Conteúdo do Feedback:</label>
                            <textarea
                                id="feedback"
                                name="feedback"
                                value={formData.feedback}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ativo">Status:</label>
                            <select
                                id="ativo"
                                name="ativo"
                                value={formData.ativo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione um status</option>
                                <option value="1">Aprovado</option>
                                <option value="2">Reprovado</option>
                                <option value="0">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button
                            type="submit"
                            disabled={updating}
                            className="primary-button"
                        >
                            {updating ? (
                                <>
                                    <FiLoader className="spin" /> Salvando...
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle /> Salvar Alterações
                                </>
                            )}
                        </button>

                        <Link href="/admin/feedbacks" passHref>
                            <button type="button" className="secondary-button">
                                Cancelar
                            </button>
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
}