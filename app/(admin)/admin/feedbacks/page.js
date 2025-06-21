'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

export default function FeedbacksAdmin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inativos, setInativos] = useState([]);
  const [reprovadas, setReprovadas] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [novos, setNovos] = useState([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
    totalPages: 1
  });

  const fetchFeedbacks = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/feedbacks?page=${page}&perPage=${pagination.perPage}`);

      if (!response.ok) {
        throw new Error(`Erro ao carregar feedbacks: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao carregar feedbacks');
      }

      // Corrigido aqui - acessamos result.data diretamente (não result.data.data)
      const feedbacks = result.data || [];

      const novos = feedbacks.filter(r => r.ativo === null);
      const inativos = feedbacks.filter(r => r.ativo === 0);
      const aprovadas = feedbacks.filter(r => r.ativo === 1);
      const reprovadas = feedbacks.filter(r => r.ativo === 2);

      setAprovadas(aprovadas);
      setReprovadas(reprovadas);
      setInativos(inativos);
      setNovos(novos);
      setTotalFeedbacks(result.pagination.total);
      setPagination({
        page: result.pagination.page,
        perPage: result.pagination.perPage,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages
      });
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar os feedbacks:', err);
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
    fetchFeedbacks(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setPagination(prev => ({ ...prev, page: newPage }));
    fetchFeedbacks(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && totalFeedbacks === 0) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando todos os feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => fetchFeedbacks(pagination.page)}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-lista-admin">
        <h1>Lista de Feedbacks - Todos ({totalFeedbacks})</h1>

        {totalFeedbacks > 0 ? (
          <div className="usuario-admin-box">

            {/* Feedbacks Novos */}
            {novos.length > 0 && (<h2>Feedbacks Novos ({novos.length})</h2>)}
            {novos.length > 0 && (
              novos.map(feedback => (
                <div key={feedback.id_feedback} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">
                    {feedback.id_feedback}. {feedback.feedback.length > 30 ? `${feedback.feedback.substring(0, 30)}...` : feedback.feedback}
                  </p>
                 <p className="usuario-tipo">
                    {feedback.receita?.titulo_receita.length > 30 ? `${feedback.receita?.titulo_receita.substring(0, 30)}...` : feedback.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                  <Link href={`/admin/feedbacks/${feedback.id_feedback}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/aprovar/${feedback.id_feedback}`}>Aprovar feedback</Link>
                </div>
              ))
            )}

            {/* Aprovadas */}
            {aprovadas.length > 0 && (<h2>Feedbacks Aprovados ({aprovadas.length})</h2>)}
            {aprovadas.length > 0 && (
              aprovadas.map(feedback => (
                <div key={feedback.id_feedback} className="usuario-admin-card usuario-aprovado">
                  <p className="usuario-nome">
                    {feedback.id_feedback}. {feedback.feedback.length > 30 ? `${feedback.feedback.substring(0, 30)}...` : feedback.feedback}
                  </p>
                  <p className="usuario-tipo">
                    {feedback.receita?.titulo_receita.length > 30 ? `${feedback.receita?.titulo_receita.substring(0, 30)}...` : feedback.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/feedbacks/${feedback.id_feedback}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/atualizar/${feedback.id_feedback}`}>Alterar |</Link>
                  <Link href={`/admin/feedbacks/deletar/${feedback.id_feedback}`}>Excluir</Link>
                </div>
              ))
            )}

            {/* Reprovadas */}
            {reprovadas.length > 0 && (<h2>Feedbacks Reprovados ({reprovadas.length})</h2>)}
            {reprovadas.length > 0 && (
              reprovadas.map((feedback, index) => (
                <div key={feedback.id_feedback} className="usuario-admin-card usuario-reprovado">
                  <p className="usuario-nome">
                    {feedback.id_feedback}. {feedback.feedback.length > 30 ? `${feedback.feedback.substring(0, 30)}...` : feedback.feedback}
                  </p>
                 <p className="usuario-tipo">
                    {feedback.receita?.titulo_receita.length > 30 ? `${feedback.receita?.titulo_receita.substring(0, 30)}...` : feedback.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/feedbacks/${feedback.id_feedback}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/atualizar/${feedback.id_feedback}`}>Alterar |</Link>
                  <Link href={`/admin/feedbacks/deletar/${feedback.id_feedback}`}>Excluir</Link>
                </div>
              ))
            )}

            {/* Inativas */}
            {inativos.length > 0 && (<h2>Feedbacks Inativos ({inativos.length})</h2>)}
            {inativos.length > 0 && (
              inativos.map(feedback => (
                <div key={feedback.id_feedback} className="usuario-admin-card usuario-inativo">
                  <p className="usuario-nome">
                    {feedback.id_feedback}. {feedback.feedback.length > 30 ? `${feedback.feedback.substring(0, 30)}...` : feedback.feedback}
                  </p>
                   <p className="usuario-tipo">
                    {feedback.receita?.titulo_receita.length > 30 ? `${feedback.receita?.titulo_receita.substring(0, 30)}...` : feedback.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/feedbacks/${feedback.id_feedback}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/atualizar/${feedback.id_feedback}`}>Alterar |</Link>
                  <Link href={`/admin/feedbacks/deletar/${feedback.id_feedback}`}>Excluir</Link>
                </div>
              ))
            )}

          </div>
        ) : (
          <div className="usuario-empty">Nenhuma feedback cadastrado.</div>
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