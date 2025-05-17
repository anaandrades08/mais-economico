"use client";

import { useMemo, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Main.module.css";
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";

export default function MaisReceitasComponente({ limit }) {
  const [receitas, setReceitas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceitasAtivas = async () => {
      try {
        const response = await fetch('/api/receitas/receitas-ativas/');
        const data = await response.json();

        if (response.ok) {
          setReceitas(data);
        } else {
          setError('Erro ao carregar mais receitas');
        }
      } catch (error) {
        setError('Erro ao tentar carregar mais receitas');
        console.error(error);
      }
    };

    fetchReceitasAtivas();
  }, []);

  function formatMinutesToHours(minutes) {
    if (!minutes && minutes !== 0) return "00:00h";
    
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

  const receitasAleatorias = useMemo(() => {
    return [...receitas].sort(() => Math.random() - 0.5).slice(0, limit);
  }, [receitas, limit]); 

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <section className={styles.recipesMoreSection}>
      <h1 className={styles.categoryTitle}>Mais Receitas</h1>
      <div className={styles.recipeMoreList}>
        {receitasAleatorias.map((recipe) => (
          <div key={recipe.id_receita} className={styles.recipeMoreItem}>
            <Link href={`/pages/receita/${recipe.id_receita}`} passHref>
              <Image
                src={recipe.img_receita || "/images/layout/recipe/image-not-found.png"}
                alt={recipe.titulo_receita || 'Imagem da receita'}
                width={250}
                height={200}
                className={styles.recipeMoreImg}
                priority
              />
            </Link>
            <p className={styles.recipeMoreTitle}>{recipe.titulo_receita}</p>
            <div className={styles.recipeMoreDetails}>
              <p className={styles.recipeMoreIncos}>
                <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                {formatMinutesToHours(recipe.tempo_preparo)}
              </p>
              <p>
                  <TbCoin size={24} className={styles.CoinIcon} aria-hidden="true" />
                                    {recipe.custo ? new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    }).format(recipe.custo) : "R$00,00"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
