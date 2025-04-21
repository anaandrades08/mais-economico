"use client";
import { useMemo, useState, useEffect } from 'react';
import styles from "../styles/Main.module.css";
import Image from "next/image";
import Link from "next/link";
import { Recipes} from "../data/RecipesData.js";
import { categorias } from "../data/CategoriaData.js";
import MaisReceitasComponente from './MaisReceita';


import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";
import { FiBookmark } from 'react-icons/fi';
import { GiCookingPot, GiSaucepan, GiCampCookingPot } from 'react-icons/gi';

const getDifficultyIcon = (level) => {
  switch (level?.toLowerCase()) {
    case 'fácil': return <GiCookingPot size={22} className={styles.Icon} aria-hidden="true" />;
    case 'médio': return <GiSaucepan size={22} className={styles.Icon} aria-hidden="true" />;
    case 'difícil': return <GiCampCookingPot size={22} className={styles.Icon} aria-hidden="true" />;
    default: return <GiCookingPot size={22} className={styles.Icon} aria-hidden="true" />;
  }
};

export default function MainContent() {
  //receitas aleatorias do mais receita
  /*const receitasAleatorias = useMemo(() => {
    return [...Recipes].sort(() => Math.random() - 0.5).slice(0, 8);
  }, []);*/

  //categorias aleatorias
  const [categoriasAleatorias, setCategoriasAleatorias] = useState([]);
  const [receitasPorCategoria, setReceitasPorCategoria] = useState([]);

  useEffect(() => {
    const categoriasEmbaralhadas = [...categorias].sort(() => Math.random() - 0.5);
    const qtdCategorias = Math.floor(Math.random() * 2) + 2; // entre 2 e 3
    const selecionadas = categoriasEmbaralhadas.slice(0, qtdCategorias);

    setCategoriasAleatorias(selecionadas);

    const receitasAgrupadas = selecionadas.map((categoria) => {
      const receitas = Recipes
        .filter((r) => r.id_category === categoria.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3); // receitas aleatórias

      return receitas.length > 0 ? { categoria, receitas } : null;
    }).filter(Boolean); // só mantém categorias com pelo menos 1 receita

    setReceitasPorCategoria(receitasAgrupadas);
  }, []);

  if (!categoriasAleatorias || receitasPorCategoria.length === 0) {
    return null;
  }


  return (


    <div className={styles.mainContainer}>
      {/* categorias aleatorias*/}
      {receitasPorCategoria.map(({ categoria, receitas }) => {
        return (
          <section key={categoria.id} className={styles.recipesSection}>
            <h1 className={styles.categoryTitle}>{categoria.name}</h1>
            <div className={styles.recipeGrid}>
              {receitas.map((receita) => (
                <div key={receita.id} className={styles.recipeBox}>
                  <Link href={`/pages/receita/${receita.id}`} passHref>
                    <Image
                      src={receita.image || "/images/layout/recipe/image-not-found.png"}
                      alt={receita.nome || 'Imagem da receita'}
                      width={350}
                      height={240}
                      className={styles.recipeImg}
                      priority={receita.id < 4}
                    />
                  </Link>
                  <h2 className={styles.recipeTitle}>{receita.nome}</h2>
                  <div className={styles.recipeDetails}>
                    <span>
                      <PiUserCircleFill size={24} className={styles.userIcon} aria-hidden="true" />
                      {receita.usuario || "Nome do usuário"}
                    </span>
                    <span>
                      <TbCalendarTime size={24} className={styles.dateTimeIcon} aria-hidden="true" />{" "}
                      {receita.tempo || "00:00h"}
                    </span>
                    <span>
                      <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                      {receita.preparo || "00:00h"}
                    </span>
                    <span>
                      <TbCoin size={24} className={styles.CoinIcon} aria-hidden="true" />
                      {receita.custo || "R$00,00"}
                    </span>
                    {receita.categoryTitle && (
                      <span>
                        <FiBookmark size={20} className={styles.Icon} aria-hidden="true" />
                        {receita.categoryTitle}
                      </span>
                    )}
                    {receita.dificuldade && (
                      <span>
                        {getDifficultyIcon(receita.dificuldade)}
                        {receita.dificuldade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}


      {/* Seção Mais Receitas */}

      {/* Componente com limit de 8 exibições */}
      <MaisReceitasComponente limit={8} />

    </div>
  );
}
