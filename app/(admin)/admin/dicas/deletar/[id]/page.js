'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2 } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function DeletarDicaAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [dica, setDica] = useState(null);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        const loadDica = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/dicas/${params.id}`);
                if (!res.ok) {
                    throw new Error(`Erro ao carregar dica: ${res.statusText}`);
                }
                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados da dica');
                }

                setDica(data);
            } catch (err) {
                console.error('Erro ao carregar dica:', err);
                setError('Erro ao carregar dica');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && params.id) {
            loadDica();
        }
    }, [session, status, router, params.id]);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir esta dica permanentemente?')) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/admin/dicas/${params.id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir dica');
            }

            setSuccess('Dica excluída com sucesso!');
            setTimeout(() => router.push('/admin/dicas'), 2000);
        } catch (err) {
            console.error('Erro ao excluir dica:', err);
            setError(err.message || 'Erro ao excluir dica');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !dica) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dica...</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Excluir Dica</h1>

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

                {dica && (
                    <div className="dica-delete-container">
                        <div className="dica-delete-preview">
                            {dica.img_dica && (
                                <Image 
                                    src={dica.img_dica} 
                                    alt={dica.titulo} 
                                    className="dica-delete-image"
                                    width={350}
                                    height={240}
                                />
                            )}
                            <h2>{dica.titulo}</h2>
                            <p>{dica.descricao}</p>
                            <div className="dica-meta">
                                <p>Categoria: {dica.categoria?.nome}</p>
                                <p>Status: {dica.ativo === 1 ? 'Ativo' : dica.ativo === 0 ? 'Inativo' : dica.ativo === 2 ? 'Pendente': 'Não Informado'}</p>
                            </div>
                        </div>

                        <div className="warning-message">
                            <FiAlertCircle size={24} />
                            <p>Atenção! Esta ação é irreversível.</p>
                            <p>Todos os dados desta dica serão permanentemente excluídos.</p>
                        </div>

                        <div className="usuario-cadastro-botoes">
                            <button 
                                onClick={handleDelete} 
                                disabled={loading}
                                className="delete-btn"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="spin" /> Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 /> Confirmar Exclusão
                                    </>
                                )}
                            </button>
                            <Link href="/admin/dicas" className="secondary">
                                Cancelar
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}