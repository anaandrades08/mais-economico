'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

export default function ReceitasAdmin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [totalCategorias, setTotalCategorias] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        totalPages: 1
    });

    const fetchCategorias = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/categorias?page=${page}&perPage=${pagination.perPage}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || response.statusText);
            }

            const result = await response.json();
            setCategorias(result.data || []);
            setTotalCategorias(result.pagination.total);
            setPagination({
                page: result.pagination.page,
                perPage: result.pagination.perPage,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages
            });
            setError(null);
        } catch (err) {
            console.error('Erro detalhado:', err);
            setError(err.message.includes('Failed to fetch')
                ? 'Erro de conexão com o servidor'
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias(pagination.page);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;

        setPagination(prev => ({ ...prev, page: newPage }));
        fetchCategorias(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando todas as categorias...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => fetchCategorias(pagination.page)}>Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="usuario-lista-admin">
                <h1>Lista de Categorias - Todas ({totalCategorias})</h1>

                <div className="usuario-admin-box">
                    {categorias.length > 0 ? (
                        categorias.map(categoria => (
                            <div key={categoria.id_categoria} className="usuario-admin-card">
                                <p className="usuario-nome">{categoria.id_categoria} - {categoria.nome}</p>
                                <p className="usuario-tipo">Link:{categoria.link_categoria}</p>
                                <Link href={`/admin/categorias/${categoria.id_categoria}`}>Visualizar |</Link>
                                <Link href={`/admin/categorias/alterar/${categoria.id_categoria}`}>Alterar </Link>
                            </div>
                        ))
                    ) : (
                        <p className="usuario-empty">Nenhuma categoria cadastrada.</p>
                    )}

                </div>

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
    )
}