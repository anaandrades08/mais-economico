'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { formatarDataeHora, formatarData } from '../../../funcoes/Usuarios';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2 } from 'react-icons/fi';

export default function UsuarioAlterarAdmin() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    data_cadastro: '',
    numero: '',
    cep: '',
    cidade: '',
    estado: '',
    email: '',
    tipo: '',
    ativo: '',
    img_usuario: '/images/usuario/fotodoperfil.png'
  });

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

        setFormData({
          nome: data.nome || '',
          endereco: data.endereco || '',
          data_cadastro: data.data_cadastro || '',
          numero: data.numero || '',
          cep: data.cep || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          email: data.email || '',
          tipo: data.tipo?.toString(),
          ativo: data.ativo?.toString(),
          img_usuario: data.img_usuario || '/images/usuario/fotodoperfil.png'
        });

        setError(null);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUsuario();
    }
  }, [params.id]);

  const handleDeletar = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Confirmação antes de deletar
    if (!confirm(`Tem certeza que deseja excluir o usuário ${formData.nome}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/usuarios/admin/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir usuário');
      }

      setSuccess('Usuário excluído com sucesso!');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/admin/usuarios');
      }, 2000);

    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setError(err.message || 'Erro ao excluir usuário');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !formData.nome) {
    return (
      <div className="admin-loading">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando dados do usuário...</p>
      </div>
    );
  }

  if (error && !formData.nome) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link href="/admin/usuarios" className="back-button">
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <section className="usuario-cadastro-admin">
        <h1>Excluir Usuário - {formData.nome}</h1>        
        <p>Cadastrado em: {formatarDataeHora(formData.data_cadastro)}</p>
        
        {/* Mensagens de feedback */}
        {error && (
          <div className="status-message error">
            <FiAlertCircle className="icon" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-btn">
              &times;
            </button>
          </div>
        )}
        
        {success && (
          <div className="status-message success">
            <FiCheckCircle className="icon" />
            <span>{success}</span>
          </div>
        )}

        <form className="usuario-cadastro-form" onSubmit={handleDeletar}>
          <div className="usuario-cadastro-inputs">
            {/* Campos desabilitados (somente leitura) */}
            <label>Nome:</label>
            <input type="text" value={formData.nome} disabled />

            <label>Endereço:</label>
            <input type="text" value={formData.endereco} disabled />

            <label>Número:</label>
            <input type="text" value={formData.numero} disabled />

            <label>CEP:</label>
            <input type="text" value={formData.cep} disabled />

            <label>Cidade:</label>
            <input type="text" value={formData.cidade} disabled />

            <label>UF:</label>
            <input type="text" value={formData.estado} disabled />

            <label>Email:</label>
            <input type="email" value={formData.email} disabled />

            <label>Tipo de usuário:</label>
            <input
              type="text"
              value={
                formData.tipo === '1'
                  ? 'Administrador'
                  : formData.tipo === '2'
                  ? 'Usuário Básico'
                  : 'Desconhecido'
              }
              disabled
            />

            <label>Status:</label>
            <input
              type="text"
              value={
                formData.ativo === '1'
                  ? 'Ativo'
                  : formData.ativo === '2'
                  ? 'Pendente'
                  : formData.ativo === '0'
                  ? 'Inativo'
                  : formData.ativo === null
                  ? 'Novo'
                  : 'Desconhecido'
              }
              disabled
            />

            <label>Foto de Perfil:</label>
            <Image
              src={formData.img_usuario}
              alt="Foto de Perfil"
              width={100}
              height={100}
              className="usuario-foto-perfil"
            />
          </div>

          <div className="usuario-cadastro-botoes">
            <button 
              type="submit" 
              disabled={deleteLoading}
              className="delete-button"
            >
              {deleteLoading ? (
                <>
                  <FiLoader className="spin" /> Excluindo...
                </>
              ) : (
                <>
                  <FiTrash2 /> Excluir Usuário
                </>
              )}
            </button>
            
            <Link href={'/admin/usuarios/'} passHref>
              <button type="button" disabled={deleteLoading}>
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}