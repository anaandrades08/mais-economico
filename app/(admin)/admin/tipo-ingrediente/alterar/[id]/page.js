'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2, FiEdit, FiArrowLeft } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function GerenciarTipoIngredienteAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const id_tipo_ingrediente = params?.id;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        // Se houver um ID na URL, carregamos os dados para edição
        if (id_tipo_ingrediente) {
            carregarTipoIngrediente();
            setIsEditing(true);
        }
    }, [session, status, router, id_tipo_ingrediente]);

    const id_usuario = session?.user?.id || 0;
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        tipo_ingrediente: '',
        total_ingredientes: 0 // Adiciona o estado para armazenar a contagem
    });

    const carregarTipoIngrediente = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/tipos-ingredientes/${id_tipo_ingrediente}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao carregar tipo de ingrediente');
            }

            setFormData({
                tipo_ingrediente: result.data.tipo_ingrediente,
                total_ingredientes: result.data.total_ingredientes || 0
            });
        } catch (err) {
            console.error('Erro ao carregar tipo de ingrediente:', err);
            setError(err.message || 'Erro ao carregar tipo de ingrediente');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const limparFormulario = () => {
        setFormData({
            tipo_ingrediente: '',
        });
        setError(null);
        setSuccess(null);
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('tipo_ingrediente', formData.tipo_ingrediente);

             const url = isEditing
                ? `/api/admin/tipos-ingredientes/${id_tipo_ingrediente}`
                : '/api/admin/tipos-ingredientes';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} tipo do ingrediente`);
            }

            setSuccess('Tipo do ingrediente atualizado com sucesso!');
            setTimeout(() => {
                if (isEditing) {
                    router.push('/admin/tipo-ingrediente');
                }
            }, 2000);

            if (!isEditing) {
                limparFormulario();
            }
        } catch (err) {
            console.error('Erro ao atualizar tipo do ingrediente:', err);
            setError(err.message || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} tipo do ingrediente`);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        if (formData.total_ingredientes > 0) {
            setError('Não é possível excluir um tipo de ingrediente com ingredientes vinculados.');
            return;
        }

        if (!window.confirm('Tem certeza que deseja excluir este tipo de ingrediente? Esta ação não pode ser desfeita.')) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/admin/tipos-ingredientes/${id_tipo_ingrediente}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir tipo de ingrediente');
            }

            setSuccess('Tipo de ingrediente excluído com sucesso!');
            setTimeout(() => {
                router.push('/admin/tipos-ingredientes');
            }, 1500);
        } catch (err) {
            console.error('Erro ao excluir tipo de ingrediente:', err);
            setError(err.message || 'Erro ao excluir tipo de ingrediente');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados do tipo de ingrediente...</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <div className="header-actions">
                    <h1>{isEditing ? 'Editar Tipo de Ingrediente' : 'Cadastrar Tipo de Ingrediente'} #{id_tipo_ingrediente}</h1>

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
                            <button onClick={() => setSuccess(null)} className="close-btn">
                                &times;
                            </button>
                        </div>
                    )}

                    <div>{isEditing && (
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="button-delete"
                        >
                            <FiTrash2 size={18} /> Excluir
                        </button>
                    )}</div>
                </div>
                <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
                    <div className="usuario-cadastro-inputs">
                        <label>Descrição do Tipo de Ingrediente:</label>
                        <input
                            type="text"
                            name="tipo_ingrediente"
                            value={formData.tipo_ingrediente}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        {isEditing && (
                            <>
                                <label>Ingredientes Vinculados:</label>
                                <input
                                    type="text"
                                    value={`${formData.total_ingredientes} ingrediente(s)`}
                                    readOnly
                                    disabled
                                    className={formData.total_ingredientes > 0 ? 'has-ingredients' : ''}
                                />
                                {formData.total_ingredientes > 0 && (
                                    <p className="warning-message">
                                        Este tipo possui ingredientes vinculados. A exclusão não será permitida.
                                    </p>
                                )}
                            </>
                        )}


                        <label>Usuário:</label>
                        <input
                            type="text"
                            value={nome_usuario}
                            readOnly
                            disabled
                        />
                        <input
                            type="hidden"
                            name="id_usuario"
                            value={id_usuario}
                        />
                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spin" /> {isEditing ? 'Atualizando...' : 'Cadastrando...'}
                                </>
                            ) : (
                                isEditing ? (
                                    <>
                                        <FiEdit size={18} /> Atualizar Tipo de Ingrediente
                                    </>
                                ) : (
                                    'Cadastrar Tipo de Ingrediente'
                                )
                            )}
                        </button>
                        {isEditing ? (
                            <Link href="/admin/tipo-ingrediente" className="back-button">
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="secondary"
                                >
                                    <FiArrowLeft size={20} /> Voltar
                                </button>
                            </Link>

                        ) : (
                            <button
                                type="button"
                                onClick={limparFormulario}
                                disabled={loading}
                                className="secondary"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </form>
            </section>
        </div>
    );
}