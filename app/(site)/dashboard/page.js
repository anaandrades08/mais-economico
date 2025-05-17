"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import "../styles/dashboard.css";
import "../styles/EnvieReceita.css";

//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();  
  const userId = session?.user?.id;
  const userNome = session?.user?.nome;
  

  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;
      console.log('Usuário logado:', id, nome, email);
    }
  }, [session]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }


  if (!userId) {
    return (
      <div className="notFound">
        <h2>Usuário não encontrado</h2>
        <Link href="/login" className="backLink">
          Voltar para login
        </Link>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <>
      <div className="dashboard-container">
      {/* titulo */ }
      < div className = "container-title" >
            <h2 className="title">Painel de Controle do Usuário</h2>
       </div >

        {/* informações básicas */ }
        < div className = "name-page" >
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
        {/* menu de links */ }
        < div className = "container-abas" >
            <div className="abas">
              <Link href={`/dashboard/envie-receita/`} passHref><button className="aba"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
              <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
              <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
              <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
            </div>
       </div>
        
        {/* seção do que abre na pagina */}
          <section className="container-send-recipe">
            <h3 className="send-recipe-title "><span className="cont-receitas">{userNome}</span></h3>
            <div className="content-recipe">
              <p>Bem-Vindo ao Painel de usuário!!!</p>
            </div>
          </section>
      </div>
    </>
  );
}
