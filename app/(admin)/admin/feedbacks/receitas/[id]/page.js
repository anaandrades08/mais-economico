'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import '../../../styles/FeedbackPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { formatarDataeHora, Status } from '../../../funcoes/Usuarios';
import { FiArrowLeft, FiLoader, FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi';

export default function FeedbacksDaReceitaAdmin() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [receita, setReceita] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Busca dados da receita
            const resReceita = await fetch(`/api/admin/receitas/${id}`);
            if (!resReceita.ok) throw new Error('Erro ao carregar receita');
            const { success: successReceita, data: dataReceita } = await resReceita.json();
            if (!successReceita) throw new Error('Erro ao carregar dados da receita');

            // Busca feedbacks da receita
            const resFeedbacks = await fetch(`/api/admin/feedbacks/receita/${id}`);
            if (!resFeedbacks.ok) throw new Error('Erro ao carregar feedbacks');
            const { success: successFeedbacks, data: dataFeedbacks } = await resFeedbacks.json();
            if (!successFeedbacks) throw new Error('Erro ao carregar feedbacks');

            setReceita(dataReceita);
            setFeedbacks(dataFeedbacks);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (feedbackId) => {
        if (!confirm('Tem certeza que deseja excluir este feedback permanentemente?')) {
            return;
        }

        try {
            setDeletingId(feedbackId);
            const res = await fetch(`/api/admin/feedbacks/${feedbackId}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao excluir feedback');
            }

            // Atualiza a lista após exclusão
            setFeedbacks(feedbacks.filter(f => f.id_feedback !== feedbackId));
        } catch (error) {
            console.error('Erro ao excluir feedback:', error);
            alert(error.message);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading && !receita) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando receita e feedbacks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <Link href="/admin/receitas" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    if (!receita) {
        return (
            <div className="error-container">
                <p>Receita não encontrada</p>
                <Link href="/admin/receitas" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="feedbacks-receita-container">
                <h1>Feedbacks da Receita: {receita.titulo_receita}</h1>
                <div className="header-with-back">
                    <button onClick={() => router.back()} className="back-button">
                        <FiArrowLeft /> Voltar
                    </button>
                </div>

                <div className="receita-feedbacks-grid">
                    {/* Seção da Receita */}
                    <div className="receita-details">
                        <div className="receita-image-container">
                            <Image
                                src={receita.img_receita || '/images/default-recipe.jpg'}
                                alt={receita.titulo_receita}
                                width={400}
                                height={300}
                                className="receita-image"
                            />
                        </div>
                        <div className="receita-info">
                            <h2>{receita.titulo_receita}</h2>
                            <p className="receita-descricao">
                                {receita.descricao_receita || 'Nenhuma descrição disponível'}
                            </p>
                            <div className="receita-stats">
                                <span><FiMessageSquare /> {feedbacks.length} feedback(s)</span>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Feedbacks */}
                    <div className="feedbacks-list">
                        <h3>Feedbacks Recebidos</h3>

                        {feedbacks.length === 0 ? (
                            <div className="empty-message">
                                Nenhum feedback encontrado para esta receita.
                            </div>
                        ) : (
                            <div className="feedback-items">
                                {feedbacks.map(feedback => (
                                    <div key={feedback.id_feedback} className="feedback-card">
                                        <div className="feedback-header">
                                            <div className="feedback-user">
                                                <Image
                                                    src={feedback.usuario?.img_usuario || '/images/usuario/default-avatar.png'}
                                                    alt={feedback.usuario?.nome}
                                                    width={40}
                                                    height={40}
                                                    className="user-avatar"
                                                />
                                                <div>
                                                    <p className="user-name">{feedback.usuario?.nome || 'Anônimo'}</p>
                                                    <p className="feedback-date">
                                                        {formatarDataeHora(feedback.data_cadastro)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`feedback-status ${feedback.ativo === 1 ? 'approved' : feedback.ativo === 2 ? 'rejected' : 'pending'}`}>
                                                {Status(feedback.ativo)}
                                            </div>
                                        </div>

                                        <div className="feedback-content">
                                            <p>{feedback.feedback}</p>
                                            {feedback.observacoes && (
                                                <div className="admin-notes">
                                                    <strong>Observações:</strong> {feedback.observacoes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="feedback-actions">
                                            <Link
                                                href={`/admin/feedbacks/alterar/${feedback.id_feedback}`}
                                                className="edit-button"
                                            >
                                                <FiEdit /> Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(feedback.id_feedback)}
                                                disabled={deletingId === feedback.id_feedback}
                                                className="delete-button"
                                            >
                                                {deletingId === feedback.id_feedback ? (
                                                    <FiLoader className="spin" />
                                                ) : (
                                                    <FiTrash2 />
                                                )}
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}