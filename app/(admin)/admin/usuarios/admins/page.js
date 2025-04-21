'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { Users } from '../../data/UserData';
import { MenuLateral } from '../menu_lateral.js';

export default function UsuariosAdmin() {
  const [loading, setLoading] = useState(true);    
  const [todosAdmins, setTodosAdmins] = useState([]);
     //valores de paginação  
    const [paginaAtual, setPaginaAtual] = useState(1);
    const usuariosPorPagina = 15;

  useEffect(() => {
    if (Users && Users.length > 0) {
      const todosAdmins = Users.filter(u => u.tipo === 1);
      setTodosAdmins(todosAdmins);
    } else {
      setTodosAdmins([]);
    }  
    setLoading(false);
  }, []); 

 // Paginação lógica
 const indexInicial = (paginaAtual - 1) * usuariosPorPagina
 const indexFinal = indexInicial + usuariosPorPagina
 const usuariosPaginados = todosAdmins.slice(indexInicial, indexFinal)
 const totalPaginas = Math.ceil(todosAdmins.length / usuariosPorPagina)

 const mudarPagina = (novaPagina) => {
   setPaginaAtual(novaPagina)
   window.scrollTo(0, 0)
 }
  if (loading) {
    return <div className="admin-loading">Carregando...</div>
  }

  return (
    
    <>
    <div className="usuario-admin-container">
      <MenuLateral/>
      <div className="usuario-lista-admin">
        <h1>Lista de Usuários Admins</h1>     
          
          <div className="usuario-admin-box">

          <h2>Admins</h2>
          {usuariosPaginados.length > 0 ? (
            usuariosPaginados.map(usuario => (
                <div key={usuario.id} className={`usuario-admin-card ${usuario.tipo === 1 ? 'admin' : ''}`}>
                  <p className="usuario-nome">{usuario.nome}</p>
                  <p className="usuario-tipo">Tipo: Admin</p>
                  <p className="usuario-ativo">Ativo: {usuario.ativo === 1 ? 'Ativo' : 'Inativo'}</p>
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar |</Link>
                  <Link href={`/admin/usuarios/alterar/${usuario.id}`}>Alterar |</Link>
                  <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum admin encontrado.</p>
            )}
          </div>
          {totalPaginas > 1 && (
                <div className="pagination">
                  {[...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => mudarPagina(i + 1)}
                      className={`page-button ${paginaAtual === i + 1 ? 'pagina-ativa' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
      </div>  
    </div>     
    </>  
  )
}
