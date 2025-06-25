'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { formatarDataeHora } from '../../../funcoes/Usuarios';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function SubstituicaoEditarAdmin() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [substituicao, setSubstituicao] = useState(null);

    const [formData, setFormData] = useState({
        descricao_preparo: '',
        ativo: '',
    });

    useEffect(() => {
        const fetchSubstituicao = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/substituicoes/${id}?complete=true`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar feedback: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados do feedback');
                }

                setSubstituicao(data);
                setFormData({
                    descricao_preparo: data.descricao_preparo || '',
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
            fetchSubstituicao();
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
                throw new Error('Selecione um status para a substituicao');
            }

            const res = await fetch(`/api/admin/substituicoes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    descricao_preparo: formData.descricao_preparo,
                    ativo: parseInt(formData.ativo),
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao atualizar substituicao');
            }

            setSuccess('Substituição atualizada com sucesso!');
            setTimeout(() => router.push('/admin/substituicoes'), 2000);
        } catch (error) {
            console.error('Erro na atualização:', error);
            setError(error.message || 'Erro ao atualizar substituicao');
        } finally {
            setUpdating(false);
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

            setSuccess('Substituicao excluído com sucesso!');
            setTimeout(() => router.push('/admin/substituicoes'), 2000);
        } catch (error) {
            console.error('Erro na exclusão:', error);
            setError(error.message || 'Erro ao excluir feedback');
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
                <p>Substituição não encontrada</p>
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
                <div className="header-with-actions">
                    <h1>Editar Substituição #{substituicao.id_substituicao}</h1>
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
                            src={substituicao.receita?.img_receita || '/images/default-recipe.png'}
                            alt={substituicao.receita?.titulo_receita || 'Foto da Receita'}
                            width={300}
                            height={200}
                            className="feedback-image"
                        />
                        <h3>{substituicao.receita?.titulo_receita || 'Receita sem título'}</h3>
                        <p className="feedback-meta">
                            <strong>Data:</strong> {formatarDataeHora(substituicao.data_cadastro)}
                        </p>
                        <p className="feedback-meta">
                            <strong>Usuário:</strong> {substituicao.usuario?.nome || 'Usuário Desconhecido'}
                        </p>
                    </div>

                    <div className="usuario-cadastro-inputs">
                        <div className="form-group">
                            <label htmlFor="substituicao">Descrição da Substituicao:</label>
                            <textarea
                                id="descricao_preparo"
                                name="descricao_preparo"
                                value={formData.descricao_preparo}
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

                        <Link href="/admin/substituicoes" passHref>
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