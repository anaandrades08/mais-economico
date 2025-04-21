'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { Users } from '../../data/UserData';
import { MenuLateral } from '../menu_lateral.js';

export default function UsuariosAdmin() {
  const [loading, setLoading] = useState(true);
  const [novos, setNovos] = useState([]);
  //valores de paginação  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const usuariosPorPagina = 15;

  useEffect(() => {
    if (Users && Users.length > 0) {
      const novos = Users.filter(u => u.ativo === null);
      setNovos(novos);
    } else {
     setNovos([]);
    }
  
    setLoading(false);
  }, []);
  // Paginação lógica
  const indexInicial = (paginaAtual - 1) * usuariosPorPagina
  const indexFinal = indexInicial + usuariosPorPagina
  const usuariosPaginados = novos.slice(indexInicial, indexFinal)
  const totalPaginas = Math.ceil(novos.length / usuariosPorPagina)

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
        <h1>Lista de Usuários Novos</h1>     
          
          <div className="usuario-admin-box">
          <h2>(Aguardando Ativação)</h2>
            {usuariosPaginados.length > 0 ? (
              usuariosPaginados.map(usuario => (
                <div id="novos" key={usuario.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{usuario.nome}</p>
                  <p className="usuario-tipo">
                    Tipo: {
                      usuario.tipo === 1 ? "Admin" :
                      usuario.tipo === 2 ? "Usuário Básico" :
                      usuario.tipo === 3 ? "Usuário Premium" : "Não Definido"
                    }
                  </p>
                  <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar |</Link>
                  <Link href={`/admin/usuarios/aprovar/${usuario.id}`}>Ativar</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum novo usuário aguardando ativação.</p>
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
