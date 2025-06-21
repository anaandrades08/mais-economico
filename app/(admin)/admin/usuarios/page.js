'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

export default function UsuariosAdmin() {
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
    totalPages: 1
  });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/usuarios/admin/?page=${page}&perPage=${pagination.perPage}`);
      
      if (!res.ok) {
        throw new Error(`Erro ao carregar usuários: ${res.statusText}`);
      }
      
      const { success, data, pagination: paginationData, error } = await res.json();
      
      if (!success) {
        throw new Error(error || 'Erro desconhecido ao carregar usuários');
      }
      
      setUsuarios(data);
      setPagination(paginationData);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar os usuários:', err);
      setError(err.message);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchUsuarios(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando todos os usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Erro ao carregar usuários: {error}</p>
        <button 
          onClick={() => fetchUsuarios(pagination.page)} 
          className="retry-button"
        >
          Tentar novamente
        </button>
        <Link href="/admin/" className="back-button">
          <FiArrowLeft size={20} /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-lista-admin">
        <h1>Lista de Usuários - Todos ({usuarios.length})</h1>
        
        <div className="usuario-admin-box">
          {usuarios.length > 0 ? (
            usuarios.map(usuario => (
              <div
                key={usuario.id}
                className={`usuario-admin-card ${usuario.tipo === 1 ? 'admin' : 
                            usuario.tipo === 2 ? 'basico' : 
                            usuario.tipo === 3 ? 'premium' : ''}
                            ${usuario.ativo === 2 ? 'usuario-reprovado' :
                            usuario.ativo === 1 ? 'usuario-aprovado' : 
                            usuario.ativo === 0 ? 'usuario-inativo' : 'usuario-novo'}`}
              > 
                <p className="usuario-nome">{usuario.nome}</p>
                <p className="usuario-tipo">
                  Tipo: {usuario.tipo === 1 ? "Admin" :
                        usuario.tipo === 2 ? "Usuário Básico" :
                        usuario.tipo === 3 ? "Usuário Premium" : "Não Definido"}
                </p>
                <p className="usuario-ativo">
                  Status: {usuario.ativo === 2 ? "Reprovado" :
                         usuario.ativo === 1 ? "Aprovado" :
                         usuario.ativo === 0 ? "Inativo" :
                         "(Aguardando aprovação)"}
                </p>
                 <div className="usuario-actions">                  
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar</Link>
                  {usuario.ativo === null ? (
                    <Link href={`/admin/usuarios/aprovar/${usuario.id}`}>Aprovar cadastro</Link>
                  ) : (
                  <>
                  <Link href={`/admin/usuarios/alterar/${usuario.id}`}>Alterar</Link>
                  <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                 </>
                 )}
                </div>
              </div>
            ))
          ) : (
            <p className="usuario-empty">Nenhum usuário encontrado.</p>
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
  );
}