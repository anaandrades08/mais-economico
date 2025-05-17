"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../../styles/dashboard.css";
import "../../styles/Favoritos.css";
import StarRating from '../../components/StarRating'; 
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserFavoritos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = session?.user?.id || session?.user?.id;
  const userNome = session?.user?.nome || session?.user?.name;

  if (status === "unauthenticated") {
    router.push("/login");  
  }

  // Carregar favoritos da API
  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/favoritos/usuario/${session.user.id}/`);
        const data = await response.json();
  
        if (response.ok) {
          // Para cada favorito, buscar a média de estrelas
          const favoritosComMedia = await Promise.all(
            (data.favoritos || []).map(async (fav) => {
              try {
                const resFeedback = await fetch(`/api/feedbacks/receitas/${fav.id_receita}/`);
                const feedbackData = await resFeedback.json();
  
                let mediaEstrelas = 0;
                if (resFeedback.ok && feedbackData.mediaEstrelas !== undefined) {
                  mediaEstrelas = feedbackData.mediaEstrelas;
                }
  
                return {
                  ...fav,
                  mediaEstrelas,
                };
              } catch (err) {
                console.error(`Erro ao buscar média para receita ${fav.id_receita}:`, err);
                return {
                  ...fav,
                  mediaEstrelas: 0, // fallback em caso de erro
                };
              }
            })
          );
  
          setFavorites(favoritosComMedia);
        } else {
          setError(data.error || 'Erro ao carregar as receitas favoritas do usuário');
          console.error(data.error || 'Erro ao carregar as receitas favoritas');
        }
      } catch (error) {
        setError('Erro ao tentar carregar as receitas favoritas do usuário');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (session?.user?.id) {
      fetchFavoritos();
    }
  }, [session]);


  //deletar favorito
  const handleDeleteFavorite = async (favoritoID) => {
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para remover favoritos');
      return;
    }

    try {
      toast.loading('Removendo dos favoritos...', { 
        toastId: 'delete-favorite',
        autoClose: false
      });

      const response = await fetch(`/api/favoritos/${favoritoID}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id_favorito !== favoritoID));
        toast.update('delete-favorite', {
          render: 'Receita removida dos favoritos!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      } else {
        const errorData = await response.json();
        toast.update('delete-favorite', {
          render: errorData.message || 'Erro ao remover receita dos favoritos',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Erro ao deletar favorito:", error);
      toast.update('delete-favorite', {
        render: 'Falha na conexão. Tente novamente.',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (status === "loading" || loading) {
    return <div className="loading">Carregando receitas favoritas...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="container-title">
        <h2 className="title">Painel de Controle do Usuário</h2>
      </div>

      <div className="name-page">
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
      </div>

      <div className="container-abas">
        <div className="abas">
          <Link href={`/dashboard/envie-receita/`} passHref>
            <button className="aba">
              <BsSendPlus size={20} className="Icon" />
              Envie uma Receita
            </button>
          </Link>
          <Link href={`/dashboard/favoritos/`} passHref>
            <button className="aba ativa">
              <MdFavoriteBorder size={20} className="Icon" />
              Receitas Favoritas
            </button>
          </Link>
          <Link href={`/dashboard/perfil-usuario/`} passHref>
            <button className="aba">
              <BiUserCircle size={20} className="Icon" />
              Dados Pessoais
            </button>
          </Link>
          <Link href={`/dashboard/feedback/`} passHref>
            <button className="aba">
              <BiMessageDetail size={20} className="Icon" />
              Feedbacks
            </button>
          </Link>
        </div>
      </div>

      <section className="container-favoritos">
        <h3>Receitas favoritas</h3>       
              
        <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
        {favorites.length > 0 ? (
          <>

            <div className="favoritos-content">
              <p>Para remover uma receita de seus favoritos, clique no X no canto superior direito.</p>
              <p>Para favoritar uma receita, entre na página da receita escolhida e clique no botão «Salvar Receita».</p>
            </div>
            <div className="favorites-list">
              {favorites.map((fav) => (
                <div key={fav.id_favorito} className="recipe-card">
                  <Link href={`/pages/receita/${fav.id_receita}`}>
                    <Image
                      src={fav.img_receita || "/images/layout/recipe/image-not-found.png"}
                      alt={fav.titulo_receita || "Titulo da receita"}
                      width={250}
                      height={200}
                      className="recipeImg"
                      priority
                    />
                  </Link>
                  <div className="recipe-content">
                    <h3>{fav.titulo_receita || "Titulo da receita"}</h3>
                    <div className="recipe-rating">
                      <StarRating totalStars={5} initialRating={fav.mediaEstrelas || 0} readOnly={true} />
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleDeleteFavorite(fav.id_favorito)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="favoritos-content">
            <p>Você ainda não adicionou nenhuma receita favorita.</p>
            <p>Para favoritar uma receita, entre na página da receita escolhida e clique no botão «Salvar Receita».</p>
          </div>
        )}

        <p className="recipe-count">
          {favorites.length === 0
            ? "Nenhuma receita favorita"
            : favorites.length === 1
              ? "1 receita encontrada"
              : `${favorites.length} receitas encontradas`}
        </p>
      </section>
    </div>
  );
}
