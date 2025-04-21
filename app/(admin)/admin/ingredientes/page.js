'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import '../styles/UsuariosPage.css';
import { MenuLateral } from './menu_lateral.js';
import { tipodeIngredientes, Ingredientes, UnidadesdeMedida } from '../data/IngredientesData.js';

export default function IngredientesAdmin() {
  const [loading, setLoading] = useState(true);     
  const [tipos, setTipos] = useState([]);
  const [unidades, SetUnidades] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    setTipos(tipodeIngredientes || []);
    SetUnidades(UnidadesdeMedida || []);
    setIngredientes(Ingredientes || []);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="admin-loading">Carregando...</div>
  }


  return (
    <div className="usuario-admin-container">
      <MenuLateral/>
      <div className="usuario-lista-admin">
        <h1>Lista de Ingredientes</h1>

          
          <div className="usuario-admin-box">

            {/* Ingredientes */}
            <h2>Ingredientes</h2>
            {ingredientes.length > 0 ? (
              ingredientes.map(ingredientes => (
                <div key={ingredientes.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{ingredientes.titulo}</p>
                  <p className="usuario-ativo">{ingredientes.tipo}</p>
                  <Link href={`/admin/ingredientes/${ingredientes.id}`}>Visualizar |</Link>                  
                  <Link href={`/admin/ingredientes/atualizar/${ingredientes.id}`}>Alterar |</Link>
                  <Link href={`/admin/ingredientes/deletar/${ingredientes.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum ingrediente encontrado.</p>
            )}

            {/* Tipos de ingredientes */}
            <h2>Tipos de Ingredientes</h2>
            {tipos.length > 0 ? (
              tipos.map(tipo => (
                <div key={tipo.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{tipo.id} - {tipo.titulo}</p>
                  <Link href={`/admin/ingredientes/tipos/${tipo.id}`}>Visualizar |</Link>
                  <Link href={`/admin/ingredientes/tipos/atualizar/${tipo.id}`}>Alterar |</Link>
                  <Link href={`/admin/ingredientes/tipos/deletar/${tipo.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhum tipo de ingrediente encontrado.</p>
            )}

             {/* Unidades */}
             <h2>Unidades de Medidas</h2>
            {unidades.length > 0 ? (
              unidades.map(unidade => (
                <div key={unidade.id} className="usuario-admin-card usuario-novo">
                  <p className="usuario-nome">{unidade.titulo}</p>
                  <p className="usuario-ativo">{unidade.sigla}</p>
                  <Link href={`/admin/ingredientes/unidades/${unidade.id}`}>Visualizar |</Link>
                  <Link href={`/admin/ingredientes/unidades/atualizar/${unidade.id}`}>Alterar |</Link>
                  <Link href={`/admin/ingredientes/unidades/deletar/${unidade.id}`}>Excluir</Link>
                </div>
              ))
            ) : (
              <p className="usuario-empty">Nenhuma unidade de medida encontrada.</p>
            )}
          </div>
      </div>
    </div>
  )
}
