'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import '../../styles/DicasPage.css';
import { formatarDataeHora } from '../../funcoes/Usuarios';
import { MenuLateral } from '../menu_lateral.js';
import { FiArrowLeft, FiEdit2, FiTrash2, FiLoader } from 'react-icons/fi';

export default function DetalhesDicaAdmin() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dica, setDica] = useState(null);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchDica = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dicas/${params.id}`);

      if (!res.ok) {
        throw new Error(`Erro ao carregar dica: ${res.statusText}`);
      }

      const { success, data, error: apiError } = await res.json();

      if (!success) {
        throw new Error(apiError || 'Erro ao carregar dados da dica');
      }

      setDica(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dica:', err);
      setError(err.message);
      setDica(null);
    } finally {
      setLoading(false);
    }
  };

  if (params.id) {
    fetchDica();
  }
}, [params.id]);

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta dica?')) {
      try {
        const res = await fetch(`/api/dicas/${params.id}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          throw new Error('Falha ao excluir dica');
        }

        router.push('/admin/dicas');
      } catch (err) {
        console.error('Erro ao excluir dica:', err);
        setError(err.message);
      }
    }
  };

  if (loading && !dica) {
    return (
      <div className="admin-loading">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando dica...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link href="/admin/dicas" className="back-button">
          <FiArrowLeft size={16} /> Voltar para lista
        </Link>
      </div>
    );
  }

  if (!dica) {
    return (
      <div className="not-found">
        <p>Dica não encontrada</p>
        <Link href="/admin/dicas" className="back-button">
          <FiArrowLeft size={16} /> Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-details-admin">
        {dica.img_dica && (
          <div className="dica-image-container">
            <Image 
              src={dica.img_dica} 
              alt={`Imagem da dica: ${dica.titulo}`} 
              width={400} 
              height={300}
              className="dica-image"
              priority
            />
          </div>
        )}
        
        <h1 className="dica-titulo">{dica.titulo || 'Sem título'}</h1>
        
        <div className="dica-meta">
          <p className="dica-categoria">
            <strong>Categoria:</strong> {dica.categoria?.nome || 'Não categorizada'}
          </p>
          <p className="dica-data">
            <strong>Data de cadastro:</strong> {formatarDataeHora(dica.data_cadastro) || 'Não informada'}
          </p>
          <p className="dica-autor">
            <strong>Autor:</strong> {dica.usuario?.nome || 'Autor desconhecido'}
          </p>
          <p className={`dica-status ${dica.ativo === 1 ? 'ativo' : 'inativo'}`}>
            <strong>Status:</strong> {dica.ativo === 1 ? 'Ativo' : 'Inativo'}
          </p>
        </div>

        <div className="dica-content">
          <h2>Descrição</h2>
          <p className="dica-descricao">{dica.descricao || 'Sem descrição'}</p>
          
          {dica.cta_text && (
            <div className="dica-cta">
              <h2>Call to Action</h2>
              <p>{dica.cta_text}</p>
            </div>
          )}
        </div>

        <div className="usuario-actions">
          <Link href="/admin/dicas" className="back-button">
            <FiArrowLeft size={16} /> Voltar para lista
          </Link>
          
          <div className="action-buttons">
            <Link href={`/admin/dicas/alterar/${dica.id_dica}`} className="edit-button">
              <FiEdit2 size={16} /> Editar
            </Link>
            <button onClick={handleDelete} className="delete-button">
              <FiTrash2 size={16} /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}