"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../../styles/dashboard.css";
import "../../styles/EnvieReceita.css";
import { Users } from "../data/UserData.js";

//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";

export default function Dashboard() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Encontra o usuário pelo ID
    const foundUser = Users.find((u) => u.id.toString() === params.id);
    setUser(foundUser);
    setLoading(false);
  }, [params.id]);

  if (loading) return <div className="loading">Carregando...</div>;

  if (!user) {
    return (
      <div className="notFound">
        <h2>Usuário não encontrado</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
      {/* titulo */ }
      < div className = "container-title" >
            <h2 className="title">Perfil do usuário</h2>
       </div >

        {/* informações básicas */ }
        < div className = "name-page" >
         <div className="name-title">
           <h2 className="nomeação">Bem vindo (ª) {user.name}</h2>
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
                <Link href={`/dashboard/perfil-usuario/${user.id}`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
                <Link href={`/dashboard/envie-receita/${user.id}`} passHref><button className="aba ativa"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
                <Link href={`/dashboard/favoritos/${user.id}`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
            </div>
       </div>
        
        {/* seção do que abre na pagina */}
          <section className="container-send-recipe">
            <h3 className="send-recipe-title ">0. <span className="cont-receitas">Receitas enviadas</span></h3>
            <div className="content-recipe">
              <p>Você ainda não enviou nenhuma receita para o + Econômico Receitas</p>
            </div>
            <div className="group-btn-send">
              <button className="btn-enviar">Enviar Receita</button>
            </div>
          </section>
      </div>
    </>
  );
}
