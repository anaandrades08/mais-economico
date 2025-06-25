'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/UsuariosPage.css';
import '../../styles/FeedbackPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiArrowLeft, FiLoader, FiMessageSquare } from 'react-icons/fi';

export default function ReceitasComFeedbackAdmin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [receitas, setReceitas] = useState([]);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 12, // Ideal para grid
        total: 0,
        totalPages: 1
    });
    const router = useRouter();

    const fetchReceitasComFeedback = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/admin/receitas/com-substituicao?page=${page}&perPage=${pagination.perPage}`
            );

            if (!response.ok) {
                throw new Error(`Erro ao carregar receitas: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erro ao carregar receitas com substituição');
            }

            setReceitas(result.data || []);
            setTotalReceitas(result.pagination.total);
            setPagination({
                page: result.pagination.page,
                perPage: result.pagination.perPage,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages
            });
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar receitas com substituição de ingredientes:', err);
            setError(err.message);
            setReceitas([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setPagination(prev => ({ ...prev, page: newPage }));
        fetchReceitasComFeedback(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchReceitasComFeedback(pagination.page);
    }, []);

    if (loading && totalReceitas === 0) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando receitas com substituição...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => fetchReceitasComFeedback(pagination.page)}>
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="usuario-lista-admin">
                <h1>Receitas com Substituição ({totalReceitas})</h1>
                <div className="header-with-back">
                    <button onClick={() => router.back()} className="back-button">
                        <FiArrowLeft /> Voltar
                    </button>
                </div>
                {totalReceitas > 0 ? (
                    <div className="receitas-grid-container">
                        <div className="receitas-grid">
                            {receitas.map(receita => (
                                <div key={receita.id_receita} className="receita-card">
                                    <Link href={`/admin/substituicoes/receitas/${receita.id_receita}`}>
                                        <div className="receita-image-container">
                                            <Image
                                                src={receita.img_receita || '/images/default-recipe.jpg'}
                                                alt={receita.titulo_receita}
                                                width={300}
                                                height={200}
                                                className="receita-image"
                                            />
                                            <div className="feedback-count">
                                                <FiMessageSquare /> {receita._count.substituicoes}
                                            </div>
                                        </div>
                                        <h3 className="receita-title">
                                            {receita.titulo_receita.length > 30
                                                ? `${receita.titulo_receita.substring(0, 30)}...`
                                                : receita.titulo_receita}
                                        </h3>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-message">
                        Nenhuma receita com substituição encontrada.
                    </div>
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