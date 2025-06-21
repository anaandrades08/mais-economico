'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuLateral } from '../menu_lateral.js';
import '../../styles/UsuariosPage.css';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function UsuariosCadastroAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    numero: '',
    cep: '',
    cidade: '',
    estado: '',
    email: '',
    senha: '',
    tipo: '', // Default para usuário comum
    ativo: '', // Default para ativo
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limparFormulario = () => {
    setFormData({
      nome: '',
      endereco: '',
      numero: '',
      cep: '',
      cidade: '',
      estado: '',
      email: '',
      senha: '',
      tipo: '',
      ativo: '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validação simples no client-side
      if (!formData.nome || !formData.email) {
        throw new Error('Nome e email são obrigatórios');
      }

      const response = await fetch('/api/usuarios/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipo: parseInt(formData.tipo),
          ativo: parseInt(formData.ativo)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar usuário');
      }

      setSuccess('Usuário cadastrado com sucesso!');
      limparFormulario();
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/admin/usuarios');
      }, 2000);

    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <section className="usuario-cadastro-admin">
        <h1>Cadastro de Usuário</h1>
        
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
            <input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              required 
            />

            <label>Endereço:</label>
            <input 
              type="text" 
              name="endereco" 
              value={formData.endereco} 
              onChange={handleChange} 
              required 
            />

            <label>Número:</label>
            <input 
              type="text" 
              name="numero" 
              value={formData.numero} 
              onChange={handleChange} 
              required 
            />

            <label>CEP:</label>
            <input 
              type="text" 
              name="cep" 
              value={formData.cep} 
              onChange={handleChange} 
              required 
            />

            <label>Cidade:</label>
            <input 
              type="text" 
              name="cidade" 
              value={formData.cidade} 
              onChange={handleChange} 
              required 
            />

            <label>UF:</label>
            <input 
              type="text" 
              name="estado" 
              value={formData.estado} 
              maxLength={2} 
              onChange={handleChange} 
              required 
            />

            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />

            <label>Tipo:</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} required>
              <option value="1">Administrador</option>
              <option value="2">Usuário Comum</option>
            </select>

            <label>Status:</label>
            <select name="ativo" value={formData.ativo} onChange={handleChange} required>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
              <option value="2">Pendente</option>
            </select>
          </div>

          <div className="usuario-cadastro-botoes">
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="spin" /> Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </button>
            <button type="button" onClick={limparFormulario} disabled={loading}>
              Limpar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}