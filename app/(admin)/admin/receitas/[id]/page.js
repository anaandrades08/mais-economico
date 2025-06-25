'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { formatarDataeHora, formatarData } from '../../funcoes/Usuarios';
import { MenuLateral } from '../menu_lateral.js';
import { FiArrowLeft, FiEdit2, FiTrash2, FiLoader } from 'react-icons/fi';

export default function DetalhesReceitaAdmin() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [receita, setReceita] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceita = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/receitas/${params.id}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar receita: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados da receita');
                }

                setReceita(data);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar receita:', err);
                setError(err.message);
                setReceita(null);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchReceita();
        }
    }, [params.id]);
    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir esta receita?')) {
            try {
                const res = await fetch(`/api/receitas/admin/${params.id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) {
                    throw new Error('Falha ao excluir receita');
                }

                router.push('/(admin)/admin/receitas');
            } catch (err) {
                console.error('Erro ao excluir receita:', err);
                alert('Erro ao excluir receita: ' + err.message);
            }
        }
    };


    if (loading) {
        return (
            <div className="admin-loading">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando a receita...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link href="/admin/usuarios" className="back-button">
                    <FiArrowLeft size={16} /> Voltar para lista
                </Link>
            </div>
        );
    }

    if (!receita) {
        return (
            <div className="not-found">
                <p>Receita não encontrada</p>
                <Link href="/admin/usuarios" className="back-button">
                    <FiArrowLeft size={16} /> Voltar para lista
                </Link>
            </div>
        );
    }
    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="usuario-details-admin">
                <div className="usuario-header-admin">
                    <h1>Detalhes da Receita</h1>
                </div>
                <div className="usuario-info-admin">
                     {receita.img_receita && (
                            <div className="image-container">
                                <Image
                                    src={receita.img_receita}
                                    alt={receita.titulo_receita}
                                    width={340}
                                    height={240}
                                    className="receita-image"
                                />
                            </div>
                        )}
                    <div className="receita-details">
                        <h2>{receita.titulo_receita}</h2>
                        <p><strong>Descrição:</strong> {receita.descricao_receita}</p>
                        <p><strong>Categoria:</strong> {receita.categoria?.nome || 'N/A'}</p>
                        <p><strong>Usuário:</strong> {receita.usuario?.nome || 'N/A'}</p>
                        <p><strong>Status:</strong> {receita.ativo === 1 ? 'Aprovada' : receita.ativo === 2 ? 'Reprovada' : 'Inativa'}</p>
                        <p><strong>Data de Cadastro:</strong> {formatarDataeHora(receita.data_cadastro)}</p>
                    </div>

                    <div className="usuario-actions">
                        <Link href="/admin/dicas" className="back-button">
                            <FiArrowLeft size={16} /> Voltar para lista
                        </Link>

                        <div className="action-buttons">
                            <Link href={`/admin/receitas/alterar/${receita.id_receita}`} className="edit-button">
                                <FiEdit2 size={16} /> Editar
                            </Link>
                            <button onClick={handleDelete} className="delete-button">
                                <FiTrash2 size={16} /> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}