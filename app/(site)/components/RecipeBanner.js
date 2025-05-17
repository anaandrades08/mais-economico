//app/components/RecipeBanner.js
"use client";
import styles from "../styles/RecipeBanner.module.css";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";
//react-icon
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";
import { MdFavoriteBorder } from "react-icons/md";
import { FiShare2, FiBookmark } from "react-icons/fi";
//import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function RecipeBanner({ recipe }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca o status de favorito
  useEffect(() => {
    if (!userId || !recipe?.idReceita) {
      setLoading(false);
      return;
    }

    const checkFavorito = async () => {
      try {
        const response = await fetch(`/api/favoritos/usuario/${userId}/${recipe.idReceita}`);
        const data = await response.json();

        if (response.ok) {
          setIsFavorito(data.isFavorito);
        } else {
          setError('Erro ao verificar favoritos');
        }
      } catch (error) {
        setError('Erro ao verificar favoritos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkFavorito();
  }, [userId, recipe?.idReceita]);

  const handleAdicionarFavorito = async () => {
    try {
      const response = await fetch(`/api/favoritos/usuario/${userId}/${recipe.idReceita}`, {
        method: 'POST'
      });

      if (response.ok) {
        setIsFavorito(true);
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  const handleRemoverFavorito = async () => {
    try {
      const response = await fetch(`/api/favoritos/usuario/${userId}/${recipe.idReceita}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setIsFavorito(false);
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  function formatMinutesToHours(minutes) {
    if (!minutes && minutes !== 0) return "Não informado";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  }
  return (
   <section className={styles.bannerContainer} aria-label="Detalhes da receita">
      <div className={styles.bannerContent} role="img" aria-label={`Imagem da receita ${recipe.titulo}`}>
        <Image
          src={recipe.img_receita} // Usa bannerImage se existir, senão usa a imagem normal
          alt={`Banner da receita ${recipe.titulo}`}
          fill
          className={styles.bannerImage}
          priority
          aria-hidden="true"
        />

        {/* Texto sobreposto no banner */}
        <div className={styles.bannerText}>
          <h2 className={styles.bannerTitle}>{recipe.titulo}</h2>
          <div className={styles.bannerInfo} aria-label="Informações da receita">
           <span>
                <TbCoin size={20} className={styles.icon} aria-hidden="true" />
                {recipe.custo === 0 ? "Grátis" :
                  recipe.custo ?
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(recipe.custo))
                    : "Custo não especificado"}
              </span>
            <span>
              <FaRegClock size={20} className={styles.icon} aria-hidden="true" />
              {formatMinutesToHours(recipe.preparo)}
            </span>
            <span>
              <PiUserCircleFill size={20} className={styles.icon} aria-hidden="true" />
              {recipe.usuario || "Autor não especificado"}
            </span>
            <span>
              <TbCalendarTime size={20} className={styles.icon} aria-hidden="true" />
              {formatMinutesToHours(recipe.tempo)}
            </span>
            <span>
              <FiBookmark size={20} className={styles.icon} aria-hidden="true" />
              {recipe.categoria || "Categoria não especificada"}
            </span>
          </div>
          <div className={styles.bannerbtngroup}>
            {/* Botão de Favoritar/Desfavoritar */}
            {userId ? (
              isFavorito ? (
                <button
                  className={`${styles.bannerbtndeletar} ${styles.favoritoAtivo}`}
                  onClick={handleRemoverFavorito}
                  disabled={loading}
                  aria-label="Remover dos favoritos"
                  aria-pressed="true"
                >
                  <MdFavoriteBorder size={20} className={styles.iconBtn} aria-hidden="true"/>
                  {loading ? 'Carregando...' : 'Receita favorita'}
                </button>
              ) : (
                <button
                  className={styles.bannerbtnsalvar}
                  onClick={handleAdicionarFavorito}
                  disabled={loading}
                  aria-label="Adicionar aos favoritos"
                  aria-pressed="true"
                >
                  <MdFavoriteBorder size={20} className={styles.iconBtn} aria-hidden="true" />
                  {loading ? 'Carregando...' : 'Salvar Receita'}
                </button>
              )
            ) : (
              <Link href="/login" className={styles.bannerbtnsalvar}>
                <MdFavoriteBorder size={20} className={styles.iconBtn} aria-hidden="true" />
                Faça login para favoritar
              </Link>
            )}
            <button
              className={styles.bannerbtncompartilhar}
              aria-label="Compartilhar receita"
              onClick={() => {
                const shareText = `Confira esta receita incrível: ${window.location.href}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <FiShare2 size={20} className={styles.iconBtn} aria-hidden="true"/>
              Compartilhar Receita
            </button>
          </div>
        </div>
      </div>
    </section >
  );
}