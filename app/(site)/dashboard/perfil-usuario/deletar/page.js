// app/dashboard/perfil-usuario/deletar/page.js
"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";
import "../../../styles/PerfilUser.css";
import "../../../styles/dashboard.css";
import { Users } from "../../../data/UserData.js";

//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function DeleteAccount() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const userId = session?.user?.id;
  const userNome = session?.user?.nome;

  const handleDeleteAccount = async () => {
    if (confirmText !== "CONFIRMAR EXCLUSÃO") {
      setError('Por favor, digite exatamente "CONFIRMAR EXCLUSÃO" para confirmar');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // 1. Verificar a senha
      const verifyRes = await axios.post('/api/auth/verify-password',
        { password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (!verifyRes.data.valid) {
        throw new Error(verifyRes.data.error || 'Senha incorreta');
      }

      // 2. Excluir a conta
      const deleteRes = await axios.delete(`/api/usuarios/${session.user.id}`, {
        withCredentials: true
      });

      if (deleteRes.data.success) {
        setSuccess(true);
        setTimeout(() => signOut({ callbackUrl: '/' }), 2000);
      } else {
        throw new Error(deleteRes.data.error || 'Falha ao excluir conta');
      }
    } catch (error) {
      console.error('Erro:', {
        message: error.message,
        response: error.response?.data
      });
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return <div className="loading">Carregando...</div>;
  }

  if (success) {
    return (
      <div className="delete-success">
        <h2>Conta Excluída com Sucesso</h2>
        <p>Redirecionando para a página inicial...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        {/* titulo */}
        < div className="container-title" >
          <h2 className="title">Painel de Controle do Usuário</h2>
        </div >

        {/* informações básicas */}
        < div className="name-page" >
          <div className="name-title">
            <h2 className="nomeação">Bem vindo (ª) {userNome}</h2>
          </div>
          <div className="descrição">
            Nessa área você poderá mudar suas informações pessoais,
            <br />
            enviar uma receita e visualizar seus favoritos.
            <br />
            <Image
              className="área-do-usuario-img"
              alt="Área do usuário"
              src="/images/layout/user/user-area.png"
              width={353}
              height={222}
            />
          </div>
        </div >
        {/* menu de links */}
        < div className="container-abas" >
          <div className="abas">
            <Link href={`/dashboard/envie-receita/`} passHref><button className="aba"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
            <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
            <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba ativa"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
            <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
          </div>
        </div>

        {/* seção do que abre na pagina */}

        <section className="container-perfil-user">
          <div className="perfil-container">
            <div className="info-pessoais">

              <div className="delete-account-container">
                <h2>Excluir Conta Permanentemente</h2>

                <div className="warning-box">
                  <h3>⚠️ Atenção!</h3>
                  <p>Ao excluir sua conta:</p>
                  <ul>
                    <li>Todos os seus dados serão removidos permanentemente</li>
                    <li>Inclusive receitas, feedbacks e receitas favoritas.</li>
                    <li>Esta ação não pode ser desfeita</li>
                  </ul>
                </div>

                <div className="confirmation-form">
                  <p>Para confirmar digite <strong>CONFIRMAR EXCLUSÃO</strong> para confirmar:</p>

                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                    placeholder="CONFIRMAR EXCLUSÃO"
                    className="confirmation-input"
                  />

                  <p>Digite sua senha atual:</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="password-input"
                  />

                  {error && <div className="error-message">{error}</div>}

                  <div className="buttons-container">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || confirmText !== "CONFIRMAR EXCLUSÃO"}
                      className="delete-button"
                    >
                      {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </button>

                    <Link href="/dashboard/perfil-usuario" className="cancel-link">
                      Cancelar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
