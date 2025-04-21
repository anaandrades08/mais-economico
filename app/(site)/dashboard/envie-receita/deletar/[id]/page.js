"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../../../../styles/dashboard.css";
import "../../../../styles/EnvieReceita.css";
import { Recipes } from "../../../../data/RecipesData.js";


//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function DeleteRecipe() {  
  const params = useParams();
  const [recipe, setRecipe] = useState(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;        
      console.log('Usuário logado:', id, nome, email);
    }
  }, [session]);
  
  const userId = session?.user?.id || session?.user?.id;
  const userNome = session?.user?.nome || session?.user?.name;

  useEffect(() => {
    if (!userId) return; 
  
    const FoundRecipe = Recipes.find(
      (r) => r.id.toString() === params.id && r.usuario_id.toString() === userId.toString()
    );
  
    if (FoundRecipe) {
      setRecipe(FoundRecipe);
    } else {
      setRecipe(null); 
    }
  }, [params.id, userId]);


  if (!userId) {
    return (
      <div className="notFound">
        <h2>Usuário não encontrado</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  if (!recipe) {
    return (
      <div className="notFound">
        <h2>Receita não encontrada</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
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

      {/* seção do que abre na pagina */}

      <section className="container-send-recipe">
        <>
          {/*Container*/}
          <div className="receita-container">
            <h2 className='receita-container-title'>Delete sua receita</h2>
            {/* div com a cor cinza */}
            <div className="receita-container-cinza">
              {/* div do form */}
              <div className="form-container">
                <form>
                  <div className="form-top">
                    <div className="form-left">
                      <h3>Sua receita</h3>
                      <div className="image-placeholder">
                          <Image id="preview" src={recipe.image} alt={recipe.nome} width={250} height={150}  />
                      </div>

                      <label className='custo'>Custo da Receita: <span className='erro-msg'>*</span></label>
                      <p>{recipe.custo}</p>

                      <label className='custo'>Rendimento da Receita: <span className='erro-msg'>*</span></label>
                      <p>{recipe.rendimento}</p>
                    </div>

                    <div className="form-right">
                      <label>Título da Receita: <span className='erro-msg'>*</span></label>
                      <p>{recipe.nome}</p>

                      <label>Descrição: <span className='erro-msg'>*</span></label>
                      <p>{recipe.descricao}</p>

                      <label>Tempo de Preparo: <span className='erro-msg'>*</span></label>
                      <p>{recipe.preparo}</p>

                      <label>Ingredientes: <span className='erro-msg'>*</span></label>
                      <p></p>
                    </div>
                  </div>

                  <div className="prepare-section">
                    <h3>Preparo</h3>
                    <p>Se a receita precisar ir ao forno, por favor, indique a temperatura de cozimento.</p>

                    <div className="steps">
                      <div className="step">
                        <h4>PASSO 1: <span className='erro-msg'>*</span></h4>
                        <input type="text" placeholder="Título opcional para etapa"  />
                        <textarea placeholder="Digite o primeiro passo da receita" required></textarea>
                      </div>

                      <div className="step">
                        <h4>PASSO 2: <span className='erro-msg'>*</span></h4>
                        <input type="text" placeholder="Título opcional para etapa"  />
                        <textarea placeholder="Digite o segundo passo da receita"  required></textarea>
                      </div>
                    </div>
                  </div>
                  <div className='group-btn'>
                    <button type="submit" className="btn-button">Excluir</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      </section>
    </div>
  );
}
