"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import "../../styles/dashboard.css";
import "../../styles/Favoritos.css";
import { favData } from "../../data/FavoritosData.js"; // Importando os favoritos
import { Recipes } from "../../data/RecipesData.js";
import { starReceita } from "../../data/StarData"

import StarRating from "../../components/StarRating" //estrelas
//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function UserFavoritos() {
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
  // Função para deletar favorito
  const handleDeleteFavorite = (recipeId) => {
    if (!userId) return;

    // Filtra removendo o favorito
    const updatedFavorites = favData.filter(
      (fav) => !(fav.id_usuario === userId && fav.id_receita === recipeId)
    );
    
    if (status="loading") return <div className="loading">Deletando...</div>;

    // Aqui você faria a chamada à API em um caso real
    // await fetch(`/api/favorites/${userId}/${recipeId}`, { method: 'DELETE' });
    // Atualiza a página para refletir as mudanças
    router.refresh();
  };

  // Agora podemos acessar userId com segurança
  const userFavorites = favData.filter(fav => fav.id_usuario === userId);
  const favoriteRecipeIds = userFavorites.map(fav => fav.id_receita);
  const favoriteRecipes = Recipes.filter(recipe =>
    favoriteRecipeIds.includes(recipe.id)
  );

  // Para uma receita específica (ex: primeira receita favorita)
  const firstRecipeId = favoriteRecipeIds[0]; // Pega o primeiro ID
  const avaliacaoReceita = starReceita.find(
    (item) => item.id_receita === firstRecipeId
  )?.countStar || 0;
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
          <Link href={`/dashboard/envie-receita/`} passHref><button className="aba"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
          <Link href={`/dashboard/favoritos/`} passHref><button className="aba ativa"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
          <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
          <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
        </div>
      </div>

      {/* seção do que abre na pagina */}
      <section className="container-favoritos">
        <h3>Receitas favoritas</h3>

        {favoriteRecipes.length > 0 ? (
          <>
            <div className="favoritos-content">
              <p>Para remover uma receita de seus favoritos, clique no X no canto superior direito.</p>
              <p>Para favoritar uma receita, entre na página da receita escolhida e clique no botão
                «Salvar Receita».</p>
            </div>
            <div className="favorites-list">
              {favoriteRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <Link href={`/pages/receita/${recipe.id}`} passHref>
                    <Image
                      src={recipe.image || "/images/layout/recipe/image-not-found.png"}
                      alt={recipe.nome || 'Imagem da receita'}
                      width={350}
                      height={240}
                      className="recipeImg"
                      priority={recipe.id < 4}
                    />
                  </Link>
                  <div className="recipe-content">
                    <h3>{recipe.nome}</h3>
                    <div className="recipe-rating"><StarRating
                      totalStars={5}
                      initialRating={avaliacaoReceita}
                      readOnly={true} // Modo somente exibição
                    /></div>
                    <div> <button 
                        className="remove-btn"
                        onClick={() => handleDeleteFavorite(recipe.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="favoritos-content">
            <p>Você ainda não adicionou nenhuma receita favorita.</p>
            <p>
              Para favoritar uma receita, entre na página da receita escolhida e clique no botão
              «Salvar Receita».</p>
          </div>
        )}
        <p className="recipe-count">
          {favoriteRecipes.length === 0
            ? "Nenhuma receita favorita"
            : favoriteRecipes.length === 1
              ? "1 receita encontrada"
              : `${favoriteRecipes.length} receitas encontradas`
          }
        </p>
      </section>
    </div>
  );
}
