'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { FeedBacks } from '../data/FeedbackData';

export default function FeedbacksAdmin() {


  const [loading, setLoading] = useState(true);     
  const [inativos, setInativos] = useState([]);
  const [reprovadas, setReprovadas] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [novos, setNovos] = useState([]); // <-- Novos feedbacks

    useEffect(() => {
        if (FeedBacks && FeedBacks.length > 0) {
            const novos = FeedBacks.filter(f => f.ativo === null); // <-- Novos feedbacks
            const inativos = FeedBacks.filter(f => f.ativo === 0);
            const aprovadas = FeedBacks.filter(f => f.ativo === 1);
            const reprovadas = FeedBacks.filter(f => f.ativo === 2);
            setAprovadas(aprovadas);
            setReprovadas(reprovadas);
            setInativos(inativos);
            setNovos(novos); 
        } else {
            setAprovadas([]);
            setReprovadas([]);
            setInativos([]);
            setNovos([]);
        }
        
        setLoading(false);
    }, []);

  if (loading) {
    return <div className="admin-loading">Carregando feedbacks...</div>
  }


  return (
    <div className="usuario-admin-container">
      <MenuLateral/>
      <div className="usuario-lista-admin">
        <h1>Lista de FeedBacks</h1>

        {FeedBacks.length > 0 ? (
          
          <div className="usuario-admin-box">

            {/* FeedBacks Novos */}
            <h2>FeedBacks Novos (Aguardando Ativação)</h2>
            {novos.length > 0 ? (
              novos.map(feedback => (
                <div key={feedback.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{feedback.mensagem}</p>
                  <p className="usuario-ativo">Ativo: Aguardando aprovação</p>
                  <Link href={`/admin/feedbacks/${feedback.id}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/aprovar/${feedback.id}`}>Ativar</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum novo feedback aguardando ativação.</p>
            )}

            {/* Aprovadas */}
            <h2>FeedBacks Aprovados</h2>
            {aprovadas.length > 0 ? (
              aprovadas.map(feedback => (
                <div key={feedback.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{feedback.mensagem}</p>
                  <p className="usuario-ativo">Ativo: Sim</p>
                  <Link href={`/admin/feedbacks/${feedback.id}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/atualizar/${feedback.id}`}>Alterar |</Link>
                  <Link href={`/admin/feedbacks/deletar/${feedback.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum feedback aprovado encontrado.</p>
            )}

             {/* Reprovadas */}
             <h2>FeedBacks Reprovados</h2>
            {reprovadas.length > 0 ? (
              reprovadas.map(feedback => (
                <div key={feedback.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{feedback.mensagem}</p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/feedbacks/${feedback.id}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/atualizar/${feedback.id}`}>Alterar |</Link>
                  <Link href={`/admin/feedbacks/deletar/${feedback.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum feedback reprovado encontrado.</p>
            )}


          {/* Inativas */}
          <h2>FeedBacks inativos</h2>
            {inativos.length > 0 ? (
              inativos.map(feedback => (
                <div key={feedback.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{feedback.mensagem}</p>
                  <p className="usuario-ativo">Ativo: Não</p>
                  <Link href={`/admin/feedbacks/${feedback.id}`}>Visualizar |</Link>
                  <Link href={`/admin/feedbacks/atualizar/${feedback.id}`}>Alterar |</Link>
                  <Link href={`/admin/feedbacks/deletar/${feedback.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum feedback inativo encontrado.</p>
            )}

          </div>
        ) : (
          <div className="usuario-empty">Nenhum feedback cadastrado.</div>
        )}
      </div>
    </div>
  )
}
