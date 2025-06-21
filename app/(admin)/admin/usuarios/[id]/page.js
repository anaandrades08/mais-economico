'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { formatarDataeHora, formatarData } from '../../funcoes/Usuarios';
import { MenuLateral } from '../menu_lateral.js';
import { FiArrowLeft, FiEdit2, FiTrash2, FiLoader } from 'react-icons/fi';

export default function DetalhesUsuarioAdmin() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/usuarios/admin/${params.id}`);

        if (!res.ok) {
          throw new Error(`Erro ao carregar usuário: ${res.statusText}`);
        }

        const { success, data, error: apiError } = await res.json();

        if (!success) {
          throw new Error(apiError || 'Erro ao carregar dados do usuário');
        }

        setUsuario(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError(err.message);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUsuario();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const res = await fetch(`/api/usuarios/admin/${params.id}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          throw new Error('Falha ao excluir usuário');
        }

        router.push('/admin/usuarios');
      } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando usuário...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link href="/admin/usuarios" className="back-button">
          <FiArrowLeft size={16} /> Voltar para lista
        </Link>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="not-found">
        <p>Usuário não encontrado</p>
        <Link href="/admin/usuarios" className="back-button">
          <FiArrowLeft size={16} /> Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-details-admin">
        <Image src={usuario.img_usuario} alt='imagem do usuário' className='usuario-image' width={100} height={100} />
        <p className="usuario-nome">Nome: {usuario.nome || 'Não informado'}</p>
        <p className="usuario-email">Email: {usuario.email || 'Não informado'}</p>
        <p className="usuario-endereco">Endereço: {usuario.endereco || 'Não informado'} N°: {usuario.numero || 'Não informado'}</p>
        <p className="usuario-cidade">Cidade: {usuario.cidade || 'Não informado'} / {usuario.estado || 'Não informado'}</p>
        <p className="usuario-cep">CEP: {usuario.cep || 'Não informado'}</p>
        <p className="usuario-data-cadastro">Data de Cadastro: {formatarDataeHora(usuario.data_cadastro) || 'Não informado'}</p>
        <p className={`usuario-tipo ${usuario.tipo === 1 ? 'admin' : ''}`}>
          Tipo: {
            usuario.tipo === 1 ? "Admin" :
              usuario.tipo === 2 ? "Usuário Básico" :
                usuario.tipo === 3 ? "Usuário Premium" : "Não Definido"
          }
        </p>
        <p className={`usuario-ativo ${usuario.ativo === 1 ? 'ativo' : ''}`}>
          Cadastro: {
            usuario.ativo === null ? "Novo" :
              usuario.ativo === 1 ? "Ativo" :
                usuario.ativo === 0 ? "Inativo" :
                  usuario.ativo === 2 ? "Pentende" : "Não Definido"
          }
        </p>
        <div className="usuario-actions">
          <Link href="/admin/usuarios">Voltar</Link>
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
    </div>
  )
}