'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { Users } from '../data/UserData';
import { MenuLateral } from './menu_lateral.js';

export default function UsuariosAdmin() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [basicos, setBasicos] = useState([]);     
  const [inativos, setInativos] = useState([]);
  const [premiums, setPremiums] = useState([]);
  const [novos, setNovos] = useState([]); // <-- Novos usuários

  useEffect(() => {
    if (Users && Users.length > 0) {
      const admins = Users.filter(u => u.tipo === 1 && u.ativo === 1);
      const basicos = Users.filter(u => u.tipo === 2 && u.ativo === 1);
      const premiums = Users.filter(u => u.tipo === 3 && u.ativo === 1);
      const inativos = Users.filter(u => u.ativo === 0);
      const novos = Users.filter(u => u.ativo === null); // <-- Novos usuários

      setAdmins(admins);
      setBasicos(basicos);
      setPremiums(premiums);
      setInativos(inativos);
      setNovos(novos); // <-- seta os novos
    } else {
      setAdmins([]);
      setBasicos([]);
      setPremiums([]);
      setInativos([]);
      setNovos([]);
    }
  
    setLoading(false);
  }, [Users]);

  if (loading) {
    return <div className="admin-loading">Carregando...</div>
  }


  return (
    <div className="usuario-admin-container">
      <MenuLateral/>
      <div className="usuario-lista-admin">
        <h1>Lista de Usuários</h1>

        {Users.length > 0 ? (
          
          <div className="usuario-admin-box">

            {/* Usuários Novos */}
            <h2>Usuários Novos (Aguardando Ativação)</h2>
            {novos.length > 0 ? (
              novos.map(usuario => (
                <div key={usuario.id} className="usuario-admin-card usuario-novo">
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

            {/* Admins */}
            <h2>Admins</h2>
            {admins.length > 0 ? (
              admins.map(usuario => (
                <div key={usuario.id} className={`usuario-admin-card ${usuario.tipo === 1 ? 'admin' : ''}`}>
                  <p className="usuario-nome">{usuario.nome}</p>
                  <p className="usuario-tipo">Tipo: Admin</p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar |</Link>
                  <Link href={`/admin/usuarios/atualizar/${usuario.id}`}>Alterar |</Link>
                  <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum admin encontrado.</p>
            )}

            {/* Usuários Básicos */}
            <h2>Usuários Básicos</h2>
            {basicos.length > 0 ? (
              basicos.map(usuario => (
                <div key={usuario.id} className={`usuario-admin-card ${usuario.tipo === 2 ? 'basico' : ''}`}>
                  <p className="usuario-nome">{usuario.nome}</p>
                  <p className="usuario-tipo">Tipo: Usuário Básico</p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar |</Link>
                  <Link href={`/admin/usuarios/atualizar/${usuario.id}`}>Alterar |</Link>
                  <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum usuário básico encontrado.</p>
            )}

            {/* Usuários Premium */}
            <h2>Usuários Premium</h2>
            {premiums.length > 0 ? (
              premiums.map(usuario => (
                <div key={usuario.id} className={`usuario-admin-card ${usuario.tipo === 3 ? 'premium' : ''}`}>
                  <p className="usuario-nome">{usuario.nome}</p>
                  <p className="usuario-tipo">Tipo: Usuário Premium</p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar |</Link>
                  <Link href={`/admin/usuarios/atualizar/${usuario.id}`}>Alterar |</Link>
                  <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum usuário premium encontrado.</p>
            )}

            {/* Inativos */}
            <h2>Inativos</h2>
            {inativos.length > 0 ? (
              inativos.map(usuario => (
                <div key={usuario.id} className="usuario-admin-card usuario-inativo">
                  <p className="usuario-nome">{usuario.nome}</p>
                  <p className="usuario-tipo">
                    Tipo: {
                      usuario.tipo === 1 ? "Admin" :
                        usuario.tipo === 2 ? "Usuário Básico" :
                          usuario.tipo === 3 ? "Usuário Premium" : "Não Definido"
                    }
                  </p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/usuarios/${usuario.id}`}>Visualizar |</Link>
                  <Link href={`/admin/usuarios/atualizar/${usuario.id}`}>Alterar |</Link>
                  <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum usuário inativo encontrado.</p>
            )}

          </div>
        ) : (
          <div className="usuario-empty">Nenhum usuário cadastrado.</div>
        )}
      </div>
    </div>
  )
}
