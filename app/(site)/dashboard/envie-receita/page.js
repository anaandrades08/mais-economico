"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import "../../styles/dashboard.css";
import "../../styles/EnvieReceita.css";
import { Recipes } from "../../data/RecipesData.js";

//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function UserDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;
      console.log('Usuário logado:', id, nome, email);
      // Aqui você pode setar um estado, fazer fetch, etc.
    }
  }, [session]);

  
  if (status === 'unauthenticated') {
    router.push('/login');
  }

  if (status === 'loading') {
    return <div className="loading">Carregando sessão...</div>;
  }
  const userId = session?.user?.id || session?.user?.id;
  const userNome = session?.user?.nome || session?.user?.name;

  const getReceitasDoUsuario = (recipes, userId) => {
    return recipes.filter((receita) => receita.usuario_id === userId);
  };

  // No seu componente:
  const receitasDoUsuario = getReceitasDoUsuario(Recipes, userId);

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

      {/* seção do que abre na pagina */}

      <section className="container-send-recipe">


        {receitasDoUsuario.length === 0 ? (
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
              {`${receitasDoUsuario.length.toString().padStart(2, '0')}.`}
              <span className="cont-receitas"> Receitas enviadas</span>
            </h3>
            <div className="recipe-grid">
              {receitasDoUsuario.map((receita) => (
                <div key={receita.id} className="recipe-card">
                  <Image src={receita.image}
                    alt={receita.nome}
                    className="recipe-image"
                    width={250}
                    height={100} />
                  <h4 className="recipe-name">{receita.nome}</h4>
                  <div className="btn-group-status-receita">
                  {receita.ativo === 0 && (
                  <button className="btn-nao-avaliado">Não avaliado</button>
                  )}
                  {receita.ativo === 1 && (
                    <button className="btn-aprovado">Aprovado</button>
                  )}
                  {receita.ativo === 2 && (
                    <Link href={`/dashboard/envie-receita/alterar/${receita.id}`} passHref>
                    <button className="btn-reprovado">Reprovado</button>
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
