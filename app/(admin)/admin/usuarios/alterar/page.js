'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  if (!usuario){
  return(
    <div className="usuario-admin-container">
      <MenuLateral />
      <div className="usuario-details-admin">
        <h2>Alterar Usuário</h2>
      </div>
    </div>
  )
}
    return (
        <div className="usuario-admin-container">
            <MenuLateral/>
            <div className="usuario-details-admin">
                <h2>Alterar Usuário</h2>
            </div>
        </div>
    )
}

