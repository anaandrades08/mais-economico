'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { Recipes } from '../data/RecipesData';

export default function ReceitasAdmin() {
  const [loading, setLoading] = useState(true);     
  const [inativos, setInativos] = useState([]);
  const [reprovadas, setReprovadas] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [novos, setNovos] = useState([]); // <-- Novos receitas

    useEffect(() => {
        if (Recipes && Recipes.length > 0) {
            const novos = Recipes.filter(r => r.ativo === null); // <-- Novos receitas
            const inativos = Recipes.filter(r => r.ativo === 0);
            const aprovadas = Recipes.filter(r => r.ativo === 1);
            const reprovadas = Recipes.filter(r => r.ativo === 2);
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
    return <div className="admin-loading">Carregando...</div>
  }


  return (
    <div className="usuario-admin-container">
      <MenuLateral/>
      <div className="usuario-lista-admin">
        <h1>Lista de Receitas</h1>

        {Recipes.length > 0 ? (
          
          <div className="usuario-admin-box">

            {/* Receitas Novos */}
            <h2>Receitas Novos (Aguardando Ativação)</h2>
            {novos.length > 0 ? (
              novos.map(receita => (
                <div key={receita.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{receita.nome}</p>
                  <p className="usuario-tipo">{receita.category}</p>
                  <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                  <Link href={`/admin/receitas/${receita.id}`}>Visualizar |</Link>
                  <Link href={`/admin/receitas/aprovar/${receita.id}`}>Ativar</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma nova receita aguardando ativação.</p>
            )}

            {/* Aprovadas */}
            <h2>Receitas Aprovadas</h2>
            {aprovadas.length > 0 ? (
              aprovadas.map(receita => (
                <div key={receita.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{receita.nome}</p>
                  <p className="usuario-tipo">{receita.category}</p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/receitas/${receita.id}`}>Visualizar |</Link>
                  <Link href={`/admin/receitas/atualizar/${receita.id}`}>Alterar |</Link>
                  <Link href={`/admin/receitas/deletar/${receita.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma receita aprovada encontrada.</p>
            )}

             {/* Reprovadas */}
             <h2>Receitas Reprovadas</h2>
            {reprovadas.length > 0 ? (
              reprovadas.map(receita => (
                <div key={receita.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{receita.nome}</p>
                  <p className="usuario-tipo">{receita.category}</p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/receitas/${receita.id}`}>Visualizar |</Link>
                  <Link href={`/admin/receitas/atualizar/${receita.id}`}>Alterar |</Link>
                  <Link href={`/admin/receitas/deletar/${receita.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma receita reprovada encontrada.</p>
            )}


          {/* Inativas */}
          <h2>Receitas inativas</h2>
            {inativos.length > 0 ? (
              inativos.map(receita => (
                <div key={receita.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{receita.nome}</p>
                  <p className="usuario-tipo">{receita.category}</p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/receitas/${receita.id}`}>Visualizar |</Link>
                  <Link href={`/admin/receitas/atualizar/${receita.id}`}>Alterar |</Link>
                  <Link href={`/admin/receitas/deletar/${receita.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma receita inativa encontrada.</p>
            )}

          </div>
        ) : (
          <div className="usuario-empty">Nenhuma receita cadastrada.</div>
        )}
      </div>
    </div>
  )
}
