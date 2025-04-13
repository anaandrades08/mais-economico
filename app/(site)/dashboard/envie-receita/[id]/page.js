"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import  "../../../styles/dashboard.css";
import  "../../../styles/EnvieReceita.css";
import { Users } from "../../data/UserData.js"; 

export default function UserDetail() {
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
  if (!user) return <div className="notFound">Usuário não encontrado</div>;

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
    <div className="userContainer">
    <div className="container-title">
      <h2 className="title">Perfil do usuário</h2>
    </div>
  
    {/* informações básicas */}
    <div className="name-page">
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
    </div>
  
    <div className="container-abas">
      <div className="abas">
        <button className="aba">Dados Pessoais</button>
        <button className="aba ativa">Envie uma Receita</button>
        <button className="aba">Receitas Favoritas</button>
      </div>
  
      <section className="container-dashboard">
        <h3>0. <span className="cont-receitas">Receitas enviadas</span></h3>
        <div className="descritivo">
          Você ainda não adicionou nenhuma receita favorita.
          <br />
          Para favoritar uma receita, entre na página da receita escolhida e clique no botão
          «Salvar Receitas».
        </div>
      </section>
    </div>
  </div>
  );
}
