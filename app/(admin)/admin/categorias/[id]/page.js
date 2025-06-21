'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiArrowLeft, FiEdit2, FiTrash2, FiLoader, FiBook, FiMessageSquare } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function DetalhesCategoriasAdmin() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState(null);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const id_categoria = params.id;

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        const fetchCategoria = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/categorias/${id_categoria}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar categoria: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados da categoria');
                }

                setCategoria(data);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar categoria:', err);
                setError(err.message);
                setCategoria(null);
            } finally {
                setLoading(false);
            }
        };

        if (id_categoria) {
            fetchCategoria();
        }
    }, [session, status, router, id_categoria]);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/categorias/${id_categoria}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.receitasAssociadas || data.dicasAssociadas) {
                    alert(`Não é possível excluir: ${data.error}`);
                } else {
                    throw new Error(data.error || 'Falha ao excluir categoria');
                }
                return;
            }

            router.push('/admin/categorias');
        } catch (err) {
            console.error('Erro ao excluir categoria:', err);
            alert('Erro ao excluir categoria: ' + err.message);
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando categorias...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link href="/admin/categorias" className="back-button">
                    <FiArrowLeft size={16} /> Voltar para lista
                </Link>
            </div>
        );
    }

    if (!categoria) {
        return (
            <div className="not-found">
                <p>Categoria não encontrada</p>
                <Link href="/admin/categorias" className="back-button">
                    <FiArrowLeft size={16} /> Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="usuario-details-admin">
                <div className="usuario-header">
                    <h1 className="usuario-nome">Categoria: {categoria.nome || 'Não informado'}</h1>
                    <p className="usuario-email">Link: {categoria.link_categoria || 'Não informado'}</p>
                </div>

                {/* Seção de Receitas Associadas */}
                <div className="associated-section">
                    <h2><FiBook /> Receitas Associadas ({categoria.receitas.length})</h2>
                    {categoria.receitas.length > 0 ? (
                        <ul className="associated-list">
                            {categoria.receitas.map(receita => (
                                <li key={receita.id_receita}>
                                    <Link href={`/admin/receitas/${receita.id_receita}`}>
                                        {receita.titulo_receita || 'Não informado'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-items">Nenhuma receita associada a esta categoria</p>
                    )}
                </div>

                {/* Seção de Dicas Associadas */}
                <div className="associated-section">
                    <h2><FiMessageSquare /> Dicas Associadas ({categoria.dicas.length})</h2>
                    {categoria.dicas.length > 0 ? (
                        <ul className="associated-list">
                            {categoria.dicas.map(dica => (
                                <li key={dica.id_dica}>
                                    <Link href={`/admin/dicas/${dica.id_dica}`}>
                                        {dica.titulo || 'Não informado'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-items">Nenhuma dica associada a esta categoria</p>
                    )}
                </div>

                <div className="usuario-actions">
                    <Link href="/admin/categorias" className="action-button back">
                        <FiArrowLeft size={16} /> Voltar
                    </Link>
                    <Link 
                        href={`/admin/categorias/alterar/${categoria.id_categoria}`} 
                        className="action-button edit"
                    >
                        <FiEdit2 size={16} /> Alterar
                    </Link>
                    <button 
                        onClick={() => setShowDeleteConfirm(true)} 
                        className="action-button delete"
                        disabled={categoria.receitas.length > 0 || categoria.dicas.length > 0}
                    >
                        <FiTrash2 size={16} /> Excluir
                    </button>
                </div>

                {/* Modal de confirmação de exclusão */}
                {showDeleteConfirm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Confirmar Exclusão</h3>
                            <p>Tem certeza que deseja excluir a categoria {categoria.nome}?</p>
                            
                            <div className="modal-actions">
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)} 
                                    className="modal-button cancel"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    className="delete-button confirm"
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? (
                                        <><FiLoader className="spin" /> Excluindo...</>
                                    ) : 'Confirmar Exclusão'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}