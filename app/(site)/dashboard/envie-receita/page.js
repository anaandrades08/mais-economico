"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import "../../styles/dashboard.css";
import "../../styles/EnvieReceita.css";

//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function UserDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = session?.user?.id || session?.user?.id;
  const userNome = session?.user?.nome || session?.user?.name;

  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;
      console.log('Usuário logado:', id, nome, email);
      fetchReceitas();
    }
  }, [session]);
  
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
//carrega o api de receitas
  const fetchReceitas = async () => {
    try {
        setLoading(true);
        const response = await fetch(`/api/receitas/usuario/${session.user.id}/`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar receitas do usuário');
        }

        const data = await response.json();
        setReceitas(data.receitas);
    } catch (error) {
        console.error('Erro ao buscar receitas do usuário:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
const totalReceitas = Array.isArray(receitas) ? receitas.length : 0;

  if (status === 'loading' || loading) {
    return <div className="loading">Carregando receitas do usuário...</div>;
  }

  return (
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
          <Link href={`/dashboard/envie-receita/`} passHref><button className="aba ativa"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
          <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
          <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
          <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
        </div>
      </div>

      {/* seção de receitas que abre na página*/}

      <section className="container-send-recipe">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {receitas.length === 0 ? (
          <>
            <h3 className="send-recipe-title">0.
              <span className="cont-receitas"> Receitas enviadas</span>
            </h3>
            <div className="content-recipe">
              <p>Você ainda não enviou nenhuma receita para o + Econômico Receitas.</p>
            </div>
          </>
        ) : (
          <>
            <h3 className="send-recipe-title">
            {`${totalReceitas.toString().padStart(2, '0')}.`}
              <span className="cont-receitas"> Receitas enviadas</span>
            </h3>
            <div className="recipe-grid">
              {receitas.map((receita) => (
                <div key={receita.id_receita} className="recipe-card">
                  <Image src={receita.img_receita || "/images/layout/recipe/image-not-found.png"}
                    alt={receita.titulo_receita || "Titulo da receita"}
                    className="recipe-image"
                    width={250}
                    height={100} 
                    priority
                    />
                  <h4 className="recipe-name">{receita.titulo_receita}</h4>
                  <div className="btn-group-status-receita">
                  {receita.ativo === null && (
                  <button className="btn-nao-avaliado">Aguardando aprovação</button>
                  )}
                  {receita.ativo === 0 && (
                  <button className="btn-inativo">Desativado</button>
                  )}
                  {receita.ativo === 1 && (
                    <button className="btn-aprovado">Aprovado</button>
                  )}
                  {receita.ativo === 2 && (
                    <Link href={`/dashboard/envie-receita/alterar/${receita.id_receita}`} passHref>
                    <button className="btn-reprovado">Não aprovado</button>
                    </Link>
                  )}

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="group-btn-send">
          <Link href={`/dashboard/envie-receita/cadastrar/`} passHref>
            <button className="btn-enviar">Enviar Receita</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
