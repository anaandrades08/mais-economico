'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

export default function DicasAdmin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inativos, setInativos] = useState([]);
    const [reprovadas, setReprovadas] = useState([]);
    const [aprovadas, setAprovadas] = useState([]);
    const [novos, setNovos] = useState([]);
    const [totalDicas, setTotalDicas] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        totalPages: 1
    });

    const fetchDicas = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/dicas?page=${page}&perPage=${pagination.perPage}`);

            if (!response.ok) {
                throw new Error(`Erro ao carregar dicas: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido ao carregar dicas');
            }

            // Corrigido aqui - acessamos result.data diretamente (não result.data.data)
            const dicas = result.data || [];

            const novos = dicas.filter(r => r.ativo === null);
            const inativos = dicas.filter(r => r.ativo === 0);
            const aprovadas = dicas.filter(r => r.ativo === 1);
            const reprovadas = dicas.filter(r => r.ativo === 2);

            setAprovadas(aprovadas);
            setReprovadas(reprovadas);
            setInativos(inativos);
            setNovos(novos);
            setTotalDicas(result.pagination.total);
            setPagination({
                page: result.pagination.page,
                perPage: result.pagination.perPage,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages
            });
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar as dicas:', err);
            setError(err.message);
            setAprovadas([]);
            setReprovadas([]);
            setInativos([]);
            setNovos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDicas(pagination.page);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;

        setPagination(prev => ({ ...prev, page: newPage }));
        fetchDicas(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && totalDicas === 0) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando todas dicas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => fetchDicas(pagination.page)}>Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="usuario-lista-admin">
                <h1>Lista de Dicas - Todas ({totalDicas})</h1>

                {totalDicas > 0 ? (
                    <div className="usuario-admin-box">

                        {/* Dicas Novos */}
                        {novos.length > 0 && (<h2>Dicas Novas ({novos.length})</h2>)}
                        {novos.length > 0 && (
                            novos.map(dica => (
                                <div key={dica.id_dica} className="usuario-admin-card usuario-novo">
                                    <p className="usuario-nome">{dica.id_dica}. {dica.titulo}</p>
                                    <p className="usuario-tipo">{dica.categoria?.nome}</p>
                                    <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                                    <Link href={`/admin/dicas/${dica.id_dica}`}>Visualizar |</Link>
                                    <Link href={`/admin/dicas/aprovar/${dica.id_dica}`}>Aprovar dica</Link>
                                </div>
                            ))
                        )}

                        {/* Aprovadas */}
                        {aprovadas.length > 0 && (<h2>Dicas Aprovadas ({aprovadas.length})</h2>)}
                        {aprovadas.length > 0 && (
                            aprovadas.map(dica => (
                                <div key={dica.id_dica} className="usuario-admin-card usuario-aprovado">
                                    <p className="usuario-nome">{dica.id_dica}. {dica.titulo}</p>
                                    <p className="usuario-tipo">{dica.categoria?.nome}</p>
                                    <p className="usuario-ativo">Ativo: Sim</p>
                                    <Link href={`/admin/dicas/${dica.id_dica}`}>Visualizar |</Link>
                                    <Link href={`/admin/dicas/alterar/${dica.id_dica}`}>Alterar |</Link>
                                    <Link href={`/admin/dicas/deletar/${dica.id_dica}`}>Excluir</Link>
                                </div>
                            ))
                        )}

                        {/* Reprovadas */}
                        {reprovadas.length > 0 && (<h2>Dicas Reprovadas ({reprovadas.length})</h2>)}
                        {reprovadas.length > 0 && (
                            reprovadas.map((dica, index) => (
                                <div key={dica.id_dica} className="usuario-admin-card usuario-reprovado">
                                    <p className="usuario-nome">{dica.id_dica}. {dica.titulo}</p>
                                    <p className="usuario-tipo">{dica.categoria?.nome}</p>
                                    <p className="usuario-ativo">Ativo: Não</p>
                                    <Link href={`/admin/dicas/${dica.id_dica}`}>Visualizar |</Link>
                                    <Link href={`/admin/dicas/alterar/${dica.id_dica}`}>Alterar |</Link>
                                    <Link href={`/admin/dicas/deletar/${dica.id_dica}`}>Excluir</Link>
                                </div>
                            ))
                        )}

                        {/* Inativas */}
                        {inativos.length > 0 && (<h2>Dicas Inativas ({inativos.length})</h2>)}
                        {inativos.length > 0 && (
                            inativos.map(dica => (
                                <div key={dica.id_dica} className="usuario-admin-card usuario-inativo">
                                    <p className="usuario-nome">{dica.id_dica}. {dica.titulo}</p>
                                    <p className="usuario-tipo">{dica.categoria?.nome}</p>
                                    <p className="usuario-ativo">Ativo: Não</p>
                                    <Link href={`/admin/dicas/${dica.id_dica}`}>Visualizar |</Link>
                                    <Link href={`/admin/dicas/alterar/${dica.id_dica}`}>Alterar |</Link>
                                    <Link href={`/admin/dicas/deletar/${dica.id_dica}`}>Excluir</Link>
                                </div>
                            ))
                        )}

                    </div>
                ) : (
                    <div className="usuario-empty">Nenhuma dica cadastrada.</div>
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
    )
}