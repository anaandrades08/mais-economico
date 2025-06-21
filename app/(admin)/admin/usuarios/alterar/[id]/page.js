'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { formatarDataeHora, formatarData } from '../../../funcoes/Usuarios';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function UsuarioAlterarAdmin() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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

        // Preenche o formulário com os dados do usuário
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const limparFormulario = () => {
    setFormData({ ...usuario });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      // Criar payload seguro
      const payload = {
        nome: formData.nome,
        email: formData.email,
        tipo: formData.tipo ? parseInt(formData.tipo) : 2,
        ativo: formData.ativo ? parseInt(formData.ativo) : 0,
        endereco: formData.endereco || undefined,
        numero: formData.numero || undefined,
        cep: formData.cep || undefined,
        cidade: formData.cidade || undefined,
        estado: formData.estado || undefined,
      };

      // Chamada correta para a API
      const res = await fetch(`/api/usuarios/admin/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro na requisição');
      }

      const data = await res.json();
      setSuccess('Usuário atualizado com sucesso!');
      setTimeout(() => router.push('/admin/usuarios'), 2000);
    } catch (error) {
      console.error('Erro na submissão:', error);
      setError(error.message || 'Erro ao atualizar usuário');
    } finally {
      setLoading(false);
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
        <h1>Alterar Usuário - {formData.nome}</h1>        
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
        <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
          <div className="usuario-cadastro-inputs">
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

            <label>Endereço:</label>
            <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />

            <label>Número:</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />

            <label>CEP:</label>
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} required />

            <label>Cidade:</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />

            <label>UF:</label>
            <input type="text" name="estado" value={formData.estado} maxLength={2} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Tipo:</label>
            <select name="tipo" value={String(formData.tipo)} onChange={handleChange}>
              <option value="1">Administrador</option>
              <option value="2">Usuário Básico</option>
            </select>

            <label>Cadastro:</label>
            <select name="ativo" value={String(formData.ativo)} onChange={handleChange}>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
              <option value="2">Pendente</option>
            </select>
          </div>

          <div className="usuario-cadastro-botoes">
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="spin" /> Alterando...
                </>
              ) : (
                <>
                <FiCheckCircle/> Atualizar usuário
                </>
              )}
            </button>
            
            <Link href={'/admin/usuarios/'} passHref><button type="button">Cancelar</button></Link>
          </div>
        </form>
      </section>
    </div>
  )
}