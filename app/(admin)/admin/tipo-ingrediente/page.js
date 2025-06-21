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
  const [tiposIngredientes, setTiposIngredientes] = useState([]);
  const [totalTiposIngredientes, setTotalTiposIngredientes] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
    totalPages: 1
  });

  const fetchTiposIngredientes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tipos-ingredientes?page=${page}&perPage=${pagination.perPage}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || response.statusText);
      }

      const result = await response.json();
      setTiposIngredientes(result.data || []);
      setTotalTiposIngredientes(result.pagination.total);
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
    fetchTiposIngredientes(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setPagination(prev => ({ ...prev, page: newPage }));
    fetchTiposIngredientes(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando todos os Tipos de Ingredientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => fetchTiposIngredientes(pagination.page)}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-lista-admin">
        <h1>Lista de Tipos de Ingredientes- Todos ({totalTiposIngredientes})</h1>

        <div className="usuario-admin-box">
          {tiposIngredientes.length > 0 ? (
            tiposIngredientes.map(tipoIngrediente => (
              <div key={tipoIngrediente.id_tipo_ingrediente} className="usuario-admin-card">
                <p className="usuario-nome">{tipoIngrediente.id_tipo_ingrediente} - {tipoIngrediente.tipo_ingrediente}</p>
                <Link href={`/admin/receitas/${tipoIngrediente.id_tipo_ingrediente}`}>Visualizar |</Link>
                <Link href={`/admin/receitas/alterar/${tipoIngrediente.id_tipo_ingrediente}`}>Alterar</Link>
                <Link href={`/admin/receitas/deletar/${tipoIngrediente.id_tipo_ingrediente}`}>Excluir</Link>
              </div>
            ))
          ) : (
            <p className="usuario-empty">Nenhum tipo de ingrediente cadastrado.</p>
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