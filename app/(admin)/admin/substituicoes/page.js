'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { Substituicoes } from '../data/SubstituicoesData';

export default function SubstituicoesAdmin() {
  const [loading, setLoading] = useState(true);     
  const [inativos, setInativos] = useState([]);
  const [reprovadas, setReprovadas] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [novos, setNovos] = useState([]); // <-- Novos feedbacks

    useEffect(() => {
        if (Substituicoes && Substituicoes.length > 0) {
            const novos = Substituicoes.filter(f => f.ativo === null); // <-- Novos Substituicoes
            const inativos = Substituicoes.filter(f => f.ativo === 0);
            const aprovadas = Substituicoes.filter(f => f.ativo === 1);
            const reprovadas = Substituicoes.filter(f => f.ativo === 2);
            setAprovadas(aprovadas);
            setReprovadas(reprovadas);
            setInativos(inativos);
            setNovos(novos); // <-- seta os novos
        } else {
            setAprovadas([]);
            setReprovadas([]);
            setInativos([]);
            setNovos([]);
        }

        setLoading(false);
    }, []);

  if (loading) {
    return <div className="admin-loading">Carregando Substituicoes...</div>
  }


  return (
    <div className="usuario-admin-container">
      <MenuLateral/>
      <div className="usuario-lista-admin">
        <h1>Lista de Substituições</h1>

        {Substituicoes.length > 0 ? (
          
          <div className="usuario-admin-box">

            {/* Substituicoes Novos */}
            <h2>Substituições Novas (Aguardando Ativação)</h2>
            {novos.length > 0 ? (
              novos.map(substituicao => (
                <div key={substituicao.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{substituicao.substituicao}</p>
                  <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                  <Link href={`/admin/substituicoes/${substituicao.id}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/aprovar/${substituicao.id}`}>Ativar</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma nova substituição aguardando ativação.</p>
            )}

            {/* Aprovadas */}
            <h2>Substituições Aprovadas</h2>
            {aprovadas.length > 0 ? (
              aprovadas.map(substituicao => (
                <div key={substituicao.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{substituicao.substituicao}</p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/substituicoes/${substituicao.id}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/atualizar/${substituicao.id}`}>Alterar |</Link>
                  <Link href={`/admin/substituicoes/deletar/${substituicao.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum substituicao aprovado encontrado.</p>
            )}

             {/* Reprovadas */}
             <h2>Substituições Reprovadas</h2>
            {reprovadas.length > 0 ? (
              reprovadas.map(substituicao => (
                <div key={substituicao.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{substituicao.substituicao}</p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/substituicoes/${substituicao.id}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/atualizar/${substituicao.id}`}>Alterar |</Link>
                  <Link href={`/admin/substituicoes/deletar/${substituicao.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma substituição reprovada encontrada.</p>
            )}


          {/* Inativas */}
          <h2>substituições Inativas</h2>
            {inativos.length > 0 ? (
              inativos.map(substituicao => (
                <div key={substituicao.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{substituicao.substituicao}</p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/substituicoes/${substituicao.id}`}>Visualizar |</Link>
                  <Link href={`/admin/substituicoes/atualizar/${substituicao.id}`}>Alterar |</Link>
                  <Link href={`/admin/substituicoes/deletar/${substituicao.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma substituição inativa encontrada.</p>
            )}

          </div>
        ) : (
          <div className="usuario-empty">Nenhuma substituição cadastrada.</div>
        )}
      </div>
    </div>
  )
}
