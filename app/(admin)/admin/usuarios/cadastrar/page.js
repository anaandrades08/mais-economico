'use client'
import React, { useState } from 'react';
import { MenuLateral } from '../menu_lateral.js';
import '../../styles/UsuariosPage.css'; // Garanta que o caminho está certo

export default function UsuariosCadastroAdmin() {
  const [formData, setFormData] = useState({
    nome: '',
    datanascimento: '',
    endereco: '',
    numero: '',
    bairro: '',
    cep: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: '',
    senha: '',
    tipo: '1',
    ativo: '1',
    image: '/images/usuario/fotodoperfil.png',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limparFormulario = () => {
    setFormData({
      nome: '',
      datanascimento: '',
      endereco: '',
      numero: '',
      bairro: '',
      cep: '',
      cidade: '',
      uf: '',
      telefone: '',
      email: '',
      senha: '',
      tipo: '1',
      ativo: '1',
      image: '/images/usuario/fotodoperfil.png',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados cadastrados:', formData);
    // Aqui você faria um fetch/axios para enviar ao backend
  };

  return (
    <div className="usuario-admin-container">
      <MenuLateral />
      <section className="usuario-cadastro-admin">
        <h1>Cadastro de Usuário</h1>
        <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
          <div className="usuario-cadastro-inputs">
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

            <label>Data de Nascimento:</label>
            <input type="date" name="datanascimento" value={formData.datanascimento} onChange={handleChange} required />

            <label>Endereço:</label>
            <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />

            <label>Número:</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />

            <label>Bairro:</label>
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />

            <label>CEP:</label>
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} required />

            <label>Cidade:</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />

            <label>UF:</label>
            <input type="text" name="uf" value={formData.uf} maxLength={2} onChange={handleChange} required />

            <label>Telefone:</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Senha:</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />

            <label>Tipo:</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="1">Administrador</option>
              <option value="2">Usuário Comum</option>
            </select>

            <label>Status:</label>
            <select name="ativo" value={formData.ativo} onChange={handleChange}>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>

            <label>Foto de Perfil (URL):</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} />
          </div>

          <div className="usuario-cadastro-botoes">
            <button type="submit">Cadastrar</button>
            <button type="button" onClick={limparFormulario}>Limpar</button>
          </div>
        </form>
      </section>
    </div>
  );
}
