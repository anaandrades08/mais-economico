'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

export default function SubstituicoesAdmin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inativos, setInativos] = useState([]);
  const [reprovadas, setReprovadas] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [novos, setNovos] = useState([]);
  const [totalSubstituicoes, setTotalSubstituicoes] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
    totalPages: 1
  });

  const fetchSubstituicoes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/substituicoes?page=${page}&perPage=${pagination.perPage}`);

      if (!response.ok) {
        throw new Error(`Erro ao carregar substituicoes!: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao carregar substituicoes');
      }

      // Corrigido aqui - acessamos result.data diretamente (não result.data.data)
      const substituicoes = result.data || [];

      const novos = substituicoes.filter(r => r.ativo === null);
      const inativos = substituicoes.filter(r => r.ativo === 0);
      const aprovadas = substituicoes.filter(r => r.ativo === 1);
      const reprovadas = substituicoes.filter(r => r.ativo === 2);

      setAprovadas(aprovadas);
      setReprovadas(reprovadas);
      setInativos(inativos);
      setNovos(novos);
      setTotalSubstituicoes(result.pagination.total);
      setPagination({
        page: result.pagination.page,
        perPage: result.pagination.perPage,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages
      });
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar os substituiccoes:', err);
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
    fetchSubstituicoes(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setPagination(prev => ({ ...prev, page: newPage }));
    fetchSubstituicoes(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && totalSubstituicoes === 0) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando todos as substituições...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => fetchSubstituicoes(pagination.page)}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-lista-admin">
        <h1>Lista de Substituições - Todas ({totalSubstituicoes})</h1>

        {totalSubstituicoes > 0 ? (
          <div className="usuario-admin-box">

            {/* Substituicoes Novos */}
            {novos.length > 0 && (<h2>Substituições Novas ({novos.length})</h2>)}
            {novos.length > 0 && (
              novos.map(substituicao => (
                <div key={substituicao.id_substituicao} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">
                    {substituicao.id_substituicao}. {substituicao.descricao_preparo.length > 30 ? `${substituicao.descricao_preparo.substring(0, 30)}...` : substituicao.substituicao}
                  </p>
                  <p className="usuario-tipo">
                    {substituicao.receita?.titulo_receita.length > 30 ? `${substituicao.receita?.titulo_receita.substring(0, 30)}...` : substituicao.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                  <Link href={`/admin/substituicoes/${substituicao.id_substituicao}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/aprovar/${substituicao.id_substituicao}`}>Aprovar substituicao</Link>
                </div>
              ))
            )}

            {/* Aprovadas */}
            {aprovadas.length > 0 && (<h2>Substituições Aprovadas ({aprovadas.length})</h2>)}
            {aprovadas.length > 0 && (
              aprovadas.map(substituicao => (
                <div key={substituicao.id_substituicao} className="usuario-admin-card usuario-aprovado">
                  <p className="usuario-nome">
                    {substituicao.id_substituicao}. {substituicao.descricao_preparo.length > 30 ? `${substituicao.descricao_preparo.substring(0, 30)}...` : substituicao.substituicao}
                  </p>
                  <p className="usuario-tipo">
                    {substituicao.receita?.titulo_receita.length > 30 ? `${substituicao.receita?.titulo_receita.substring(0, 30)}...` : substituicao.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/substituicoes/${substituicao.id_substituicao}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/atualizar/${substituicao.id_substituicao}`}>Alterar |</Link>
                  <Link href={`/admin/substituicoes/deletar/${substituicao.id_substituicao}`}>Excluir</Link>
                </div>
              ))
            )}

            {/* Reprovadas */}
            {reprovadas.length > 0 && (<h2>Substituições Reprovadas ({reprovadas.length})</h2>)}
            {reprovadas.length > 0 && (
              reprovadas.map((substituicao, index) => (
                <div key={substituicao.id_substituicao} className="usuario-admin-card usuario-reprovado">
                  <p className="usuario-nome">
                    {substituicao.id_substituicao}. {substituicao.descricao_preparo.length > 30 ? `${substituicao.descricao_preparo.substring(0, 30)}...` : substituicao.substituicao}
                  </p>
                  <p className="usuario-tipo">
                    {substituicao.receita?.titulo_receita.length > 30 ? `${substituicao.receita?.titulo_receita.substring(0, 30)}...` : substituicao.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/substituicoes/${substituicao.id_substituicao}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/atualizar/${substituicao.id_substituicao}`}>Alterar |</Link>
                  <Link href={`/admin/substituicoes/deletar/${substituicao.id_substituicao}`}>Excluir</Link>
                </div>
              ))
            )}

            {/* Inativas */}
            {inativos.length > 0 && (<h2>Substituições Inativas ({inativos.length})</h2>)}
            {inativos.length > 0 && (
              inativos.map(substituicao => (
                <div key={substituicao.id_substituicao} className="usuario-admin-card usuario-inativo">
                  <p className="usuario-nome">
                    {substituicao.id_substituicao}. {substituicao.descricao_preparo.length > 30 ? `${substituicao.descricao_preparo.substring(0, 30)}...` : substituicao.substituicao}
                  </p>
                  <p className="usuario-tipo">
                    {substituicao.receita?.titulo_receita.length > 30 ? `${substituicao.receita?.titulo_receita.substring(0, 30)}...` : substituicao.receita?.titulo_receita}
                  </p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/substituicoes/${substituicao.id_substituicao}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/atualizar/${substituicao.id_substituicao}`}>Alterar |</Link>
                  <Link href={`/admin/substituicoes/deletar/${substituicao.id_substituicao}`}>Excluir</Link>
                </div>
              ))
            )}

          </div>
        ) : (
          <div className="usuario-empty">Nenhuma substituição cadastrada.</div>
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