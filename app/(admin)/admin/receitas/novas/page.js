'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

export default function ReceitasAdmin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [receitas, setReceitas] = useState([]);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        totalPages: 1
    });

    const searchParams = useSearchParams();
    //const filter = searchParams.get('filter') || 'all';
    const filter = searchParams.get('filter') || 'novas'; // Padrão para 'novo' se não houver filtro

    const fetchReceitas = async (page = 1) => {
        try {
            setLoading(true);
            const url = `/api/receitas/receitas-admin?page=${page}&perPage=${pagination.perPage}&filter=${filter}`
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao carregar receitas: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao carregar receitas');
            }

            setReceitas(result.data || []);
            setTotalReceitas(result.length || 0);
            setPagination({
                page: result.pagination.page,
                perPage: result.pagination.perPage,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages
            });
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar as receitas:', err);
            setError(err.message);
            setReceitas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceitas(pagination.page);
    }, [filter]); // Atualiza quando o filtro muda

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;

        setPagination(prev => ({ ...prev, page: newPage }));
        fetchReceitas(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && totalReceitas === 0) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando receitas {filter}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => fetchReceitas(pagination.page)}>Tentar novamente</button>
            </div>
        );
    }

    const getFilteredTitle = () => {
        switch (filter) {
            case 'novas': return 'Novas';
            case 'aprovadas': return 'Aprovadas';
            case 'reprovadas': return 'Reprovadas';
            case 'inativas': return 'Inativas';
            default: return 'Todas';
        }
    };

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="usuario-lista-admin">
                <h1>Receitas {getFilteredTitle()} ({receitas.length})</h1>

                {receitas.length > 0 ? (
                    <div className="usuario-admin-box">
                        {receitas.map(receita => (
                            <div key={receita.id_receita} className="usuario-admin-card usuario-novo">
                                <p className="usuario-nome">{receita.titulo_receita}</p>
                                <p className="usuario-tipo">{receita.categoria?.nome}</p>
                                <p className="usuario-ativo">
                                    Status: {getStatusText(receita.ativo)}
                                </p>
                                <div className="usuario-actions">
                                    <Link href={`/admin/receitas/${receita.id_receita}`}>Visualizar</Link>
                                    {receita.ativo === null ? (
                                        <Link href={`/admin/receitas/aprovar/${receita.id_receita}`}>Aprovar</Link>
                                    ) : (
                                        <>
                                            <Link href={`/admin/receitas/atualizar/${receita.id_receita}`}>Alterar</Link>
                                            <Link href={`/admin/receitas/deletar/${receita.id_receita}`}>Excluir</Link>
                                        </>

                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="usuario-empty">Nenhuma receita encontrada.</div>
                )}
                
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        Anterior
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={pagination.page === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        Próxima
                    </button>
                </div>
            )}
            </div>
        </div>
    );
}

function getStatusText(status) {
    switch (status) {
        case null: return 'Aguardando aprovação';
        case 0: return 'Inativa';
        case 1: return 'Aprovada';
        case 2: return 'Reprovada';
        default: return 'Desconhecido';
    }
}