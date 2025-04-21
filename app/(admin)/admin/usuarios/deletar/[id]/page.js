'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { Users } from '../../../data/UserData';
import { formatarDataeHora, formatarData } from '../../../funcoes/Usuarios';
import { MenuLateral } from '../../menu_lateral.js';

export default function UsuarioAlterarAdmin() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

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

  useEffect(() => {
    const foundUser = Users.find((r) => r.id === params.id || r.id.toString() === params.id);
    if (foundUser) {
      setUsuario(foundUser);
      setFormData({ ...foundUser });
    }
    setLoading(false);
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limparFormulario = () => {
    setFormData({ ...usuario });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados alterados:', formData);
    // Aqui você envia os dados atualizados para o backend com fetch/axios
  };

  if (loading) {
    return <div className="admin-loading">Carregando...</div>;
  }

  if (!usuario) {
    return (
      <div className="usuario-admin-container">
        <MenuLateral />
        <div className="usuario-details-admin">
          <h2>Usuário não encontrado</h2>
        </div>
      </div>
    );
  }
    return (
   <div className="usuario-admin-container">
      <MenuLateral />
      <section className="usuario-cadastro-admin">
        <h1>Excluir Usuário - {formData.nome}</h1>
        <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
          <div className="usuario-cadastro-inputs">
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange}  disabled />

            <label>Data de Nascimento:</label>
            <input type="date" name="datanascimento" value={formData.datanascimento} onChange={handleChange} disabled />

            <label>Endereço:</label>
            <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} disabled />

            <label>Número:</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} disabled />

            <label>Bairro:</label>
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} disabled />

            <label>CEP:</label>
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} disabled />

            <label>Cidade:</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} disabled />

            <label>UF:</label>
            <input type="text" name="uf" value={formData.uf} maxLength={2} onChange={handleChange} disabled />

            <label>Telefone:</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} disabled />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />

            <label>Senha:</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} disabled />

            <label>Tipo:</label>
            <input
                type="text"
                value={
                  formData.tipo === '1'
                    ? 'Administrador'
                    : formData.tipo === '2'
                    ? 'Usuário Básico'
                    : formData.tipo === '3'
                    ? 'Usuário Premium'
                    : 'Desconhecido'
                }
                disabled
             />
            <label>Ativo:</label>
            <input
                type="text"
                value={
                  formData.ativo === '1'
                    ? 'Ativo'
                    : formData.ativo === '2'
                    ? 'Reprovado'
                    : formData.ativo === '0'
                    ? 'Inativo'
                    : 'Desconhecido'
                }
                disabled
             />

            <label>Foto de Perfil (URL):</label>
            <Image
              src={formData.image}
              alt="Foto de Perfil"
              width={100}
              height={100}
              className="usuario-foto-perfil"
            />
          </div>

          <div className="usuario-cadastro-botoes">
            <button type="submit">Excluir</button>
            <Link href={'/admin/usuarios/deletar/'} passHref><button type="button">Cancelar</button></Link>
          </div>
        </form>
      </section>
    </div>
    )
}

