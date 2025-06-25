'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function ExcluirIngredienteAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const id_ingrediente = params?.id;
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [ingrediente, setIngrediente] = useState(null);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
            return;
        }
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        const carregarIngrediente = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/admin/ingredientes/${id_ingrediente}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Erro ao carregar ingrediente');
                }

                if (!result.data) {
                    throw new Error('Ingrediente não encontrado');
                }

                setIngrediente(result.data);
            } catch (err) {
                console.error('Erro ao carregar ingrediente:', err);
                setError(err.message || 'Erro ao carregar ingrediente');
                router.push('/admin/ingredientes');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && id_ingrediente) {
            carregarIngrediente();
        }
    }, [session, status, router, id_ingrediente]);

    const handleDelete = async () => {
         if (ingrediente.total_ingredientesReceita > 0) {
            setError('Não é possível excluir um ingrediente com ingredientes vinculados em receitas.');
            return;
        }
        if (!window.confirm('Tem certeza que deseja excluir este ingrediente?\nEsta ação não pode ser desfeita.')) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Verifica se há receitas vinculadas
            if (ingrediente?.total_ingredientesReceita > 0) {
                throw new Error('Não é possível excluir: existem receitas vinculadas a este ingrediente');
            }

            const response = await fetch(`/api/admin/ingredientes/${id_ingrediente}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir ingrediente');
            }

            setSuccess('Ingrediente excluído com sucesso!');
            setTimeout(() => {
                router.push('/admin/ingredientes');
            }, 2000);
        } catch (err) {
            console.error('Erro ao excluir ingrediente:', err);
            setError(err.message || 'Erro ao excluir ingrediente');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !ingrediente) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados do ingrediente...</p>
            </div>
        );
    }

    if (!ingrediente) {
        return (
            <div className="usuario-admin-container">
                <MenuLateral />
                <section className="usuario-cadastro-admin">
                    <div className="status-message error">
                        <FiAlertCircle className="icon" />
                        <span>Ingrediente não encontrado</span>
                        <Link href="/admin/ingredientes" className="back-button">
                            <button type="button" className="secondary">
                                <FiArrowLeft size={20} /> Voltar
                            </button>
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Excluir Ingrediente #{id_ingrediente}</h1>

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

                <div className="ingrediente-details">
                    <h2>{ingrediente.descricao_ingrediente}</h2>
                    
                    <div className="detail-row">
                        <span className="detail-label">Tipo:</span>
                        <span className="detail-value">{ingrediente.tipoIngrediente?.tipo_ingrediente || 'Não especificado'}</span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">Valor:</span>
                        <span className="detail-value">R$ {parseFloat(ingrediente.valor).toFixed(2)}</span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">Quantidade:</span>
                        <span className="detail-value">{ingrediente.quantidade} {ingrediente.unidadeMedida?.sigla || ''}</span>
                    </div>
                    
                    {ingrediente.total_ingredientesReceita > 0 && (
                        <div className="warning-message">
                            <FiAlertCircle size={18} /> 
                            <span> Este ingrediente está vinculado a {ingrediente.total_ingredientesReceita} receita(s) e não pode ser excluído</span>
                        </div>
                    )}
                </div>

                <div className="usuario-cadastro-botoes">
                    <button 
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="delete-button"
                        title={ingrediente.total_ingredientesReceita > 0 ? 
                            'Existem receitas vinculadas a este ingrediente' : ''}
                    >
                        {loading ? (
                            <>
                                <FiLoader className="spin" /> Excluindo...
                            </>
                        ) : (
                            <>
                                <FiTrash2 size={18} /> Confirmar Exclusão
                            </>
                        )}
                    </button>
                     <Link href="/admin/ingredientes" className="back-button">
                            <button
                                type="button"
                                disabled={loading}
                                className="secondary"
                            >
                                <FiArrowLeft size={20} /> Voltar
                            </button>
                        </Link>
                </div>
            </section>
        </div>
    );
}