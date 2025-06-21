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
  const [inativos, setInativos] = useState([]);
  const [reprovadas, setReprovadas] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [novos, setNovos] = useState([]);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
    totalPages: 1
  });

  const fetchReceitas = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/receitas/receitas-admin?page=${page}&perPage=${pagination.perPage}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar receitas: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido ao carregar receitas');
      }

      // Corrigido aqui - acessamos result.data diretamente (não result.data.data)
      const receitas = result.data || [];
      
      const novos = receitas.filter(r => r.ativo === null);
      const inativos = receitas.filter(r => r.ativo === 0);
      const aprovadas = receitas.filter(r => r.ativo === 1);
      const reprovadas = receitas.filter(r => r.ativo === 2);

      setAprovadas(aprovadas);
      setReprovadas(reprovadas);
      setInativos(inativos);
      setNovos(novos);
      setTotalReceitas(result.pagination.total);
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
      setAprovadas([]);
      setReprovadas([]);
      setInativos([]);
      setNovos([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReceitas(pagination.page);
  }, []);

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
        <p>Carregando todas receitas...</p>
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

return (
  <div className="usuario-admin-container">
    <MenuLateral />
    <div className="usuario-lista-admin">
      <h1>Lista de Receitas - Todas ({totalReceitas})</h1>

      {totalReceitas > 0 ? (
        <div className="usuario-admin-box">

          {/* Receitas Novos */}
          {novos.length > 0 && ( <h2>Receitas Novas ({novos.length})</h2>)}
          {novos.length > 0 && (
            novos.map(receita => (
              <div key={receita.id_receita} className="usuario-admin-card usuario-novo">
                <p className="usuario-nome">{receita.id_receita} - {receita.titulo_receita}</p>
                <p className="usuario-tipo">Usuário: {receita.usuario?.nome}</p>
                <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                <Link href={`/admin/receitas/${receita.id_receita}`}>Visualizar |</Link>
                <Link href={`/admin/receitas/aprovar/${receita.id_receita}`}>Aprovar receita</Link>
              </div>
            ))
          )}

          {/* Aprovadas */}
          {aprovadas.length > 0 && ( <h2>Receitas Aprovadas ({aprovadas.length})</h2>)}
          {aprovadas.length > 0 && (
            aprovadas.map(receita => (
              <div key={receita.id_receita} className="usuario-admin-card usuario-aprovado">
                <p className="usuario-nome">{receita.id_receita} - {receita.titulo_receita}</p>
                <p className="usuario-tipo">Usuário: {receita.usuario?.nome}</p>
                <p className="usuario-ativo">Ativo: Sim</p>
                <Link href={`/admin/receitas/${receita.id_receita}`}>Visualizar |</Link>
                <Link href={`/admin/receitas/atualizar/${receita.id_receita}`}>Alterar |</Link>
                <Link href={`/admin/receitas/deletar/${receita.id_receita}`}>Excluir</Link>
              </div>
            ))
          )}

          {/* Reprovadas */}
          {reprovadas.length > 0 && ( <h2>Receitas Reprovadas ({reprovadas.length})</h2>)}
          {reprovadas.length > 0 && (
            reprovadas.map( (receita, index) => (
              <div key={receita.id_receita} className="usuario-admin-card usuario-reprovado">
                <p className="usuario-nome">{receita.id_receita} - {receita.titulo_receita}</p>
                <p className="usuario-tipo">Usuário: {receita.usuario?.nome}</p>
                <p className="usuario-ativo">Ativo: Não</p>
                <Link href={`/admin/receitas/${receita.id_receita}`}>Visualizar |</Link>
                <Link href={`/admin/receitas/atualizar/${receita.id_receita}`}>Alterar |</Link>
                <Link href={`/admin/receitas/deletar/${receita.id_receita}`}>Excluir</Link>
              </div>
            ))
          )}

          {/* Inativas */}
          {inativos.length > 0 && ( <h2>Receitas Inativas ({inativos.length})</h2>)}
          {inativos.length > 0 && (
            inativos.map(receita => (
              <div key={receita.id_receita} className="usuario-admin-card usuario-inativo">
                <p className="usuario-nome">{receita.id_receita} - {receita.titulo_receita}</p>
                <p className="usuario-tipo">Usuário: {receita.usuario?.nome}</p>
                <p className="usuario-ativo">Ativo: Não</p>
                <Link href={`/admin/receitas/${receita.id_receita}`}>Visualizar |</Link>
                <Link href={`/admin/receitas/atualizar/${receita.id_receita}`}>Alterar |</Link>
                <Link href={`/admin/receitas/deletar/${receita.id_receita}`}>Excluir</Link>
              </div>
            ))
          )}

        </div>
      ) : (
        <div className="usuario-empty">Nenhuma receita cadastrada.</div>
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