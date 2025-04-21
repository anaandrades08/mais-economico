'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { Users } from '../../data/UserData';
import { formatarDataeHora, formatarData } from '../../funcoes/Usuarios';

import { MenuLateral } from '../menu_lateral.js';


export default function UsuariosAdmin() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState([])

  useEffect(() => {
    // Encontra o usuario pelo ID
    const foundUser = Users.find(
      r => r.id === params.id || r.id.toString() === params.id
    )
    setUsuario(foundUser)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className="admin-loading">Carregando...</div>
  }

    return (
        <div className="usuario-admin-container">
            <MenuLateral/>
            <div className="usuario-details-admin">
                <Image src={usuario.image} alt={usuario.name} className="usuario-image" width={100} height={100} />
                <p className="usuario-nome">Nome: {usuario.nome}</p>                
                <p className="usuario-data-nascimento">Data de Nascimento: {formatarData(usuario.datanascimento)}</p>
                <p className="usuario-email">Email: {usuario.email}</p>
                <p className="usuario-telefone">Telefone: {usuario.telefone}</p>
                <p className="usuario-endereco">Endereço: {usuario.endereco} n° {usuario.numero}</p>
                <p className="usuario-bairro"> Bairro: {usuario.bairro}</p>
                <p className="usuario-cidade">Cidade: {usuario.cidade} / {usuario.uf}</p>
                <p className="usuario-cep">CEP: {usuario.cep}</p>
                <p className="usuario-data-cadastro">Data de Cadastro: {formatarDataeHora(usuario.datacadastro)}</p>
                <p className={`usuario-tipo ${usuario.tipo === 1 ? 'admin' : ''}`}>
                Tipo: {
                    usuario.tipo === 1 ? "Admin" :
                      usuario.tipo === 2 ? "Usuário Básico" :
                        usuario.tipo === 3 ? "Usuário Premium" : "Não Definido"
                  }
                </p>
                <p className={`usuario-ativo ${usuario.ativo === 1 ? 'ativo' : ''}`}>
                    Ativo: {
                        usuario.ativo === 1 ? "Ativo" :
                            usuario.ativo === 0 ? "Inativo" : "Não Definido"
                    }
                </p>
                <div className="usuario-actions">
                    <Link href="/admin/usuarios">Voltar</Link>
                    <Link href={`/admin/usuarios/alterar/${usuario.id}`}>Alterar</Link>
                    <Link href={`/admin/usuarios/deletar/${usuario.id}`}>Excluir</Link>
                </div>
            </div>
        </div>
    )
}

