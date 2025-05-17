"use client";
import { useState, useEffect } from 'react';
import styles from "../styles/Main.module.css";
import Image from "next/image";
import Link from "next/link";
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
  const [categorias, setCategorias] = useState([]);
  const [Recipes, setRecipes] = useState([]);
  const [categoriasAleatorias, setCategoriasAleatorias] = useState([]);
  const [receitasPorCategoria, setReceitasPorCategoria] = useState([]);
  const [error, setError] = useState(null);

  // Carregar categorias da API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias/');
        const data = await response.json();
        if (response.ok) {
          setCategorias(data);
        } else {
          setError('Erro ao carregar as categorias do header');
        }
      } catch (error) {
        setError('Erro ao tentar carregar as categorias do header');
        console.error(error);
      }
    };

    fetchCategorias();
  }, []);

  // Carregar receitas ativas da API
  useEffect(() => {
    const fetchReceitasAtivas = async () => {
      try {
        const response = await fetch('/api/receitas/receitas-ativas/');
        const data = await response.json();
        if (response.ok) {
          setRecipes(data);
        } else {
          setError('Erro ao carregar as receitas ativas');
        }
      } catch (error) {
        setError('Erro ao tentar carregar as receitas ativas');
        console.error(error);
      }
    };

    fetchReceitasAtivas();
  }, []);

  // Quando categorias e receitas forem carregadas, gerar as categorias aleatórias
  useEffect(() => {
    if (categorias.length > 0 && Recipes.length > 0) {
      const categoriasEmbaralhadas = [...categorias].sort(() => Math.random() - 0.5);
      const qtdCategorias = Math.floor(Math.random() * 2) + 2; // entre 2 e 3
      const selecionadas = categoriasEmbaralhadas.slice(0, qtdCategorias);

      setCategoriasAleatorias(selecionadas);

      const receitasAgrupadas = selecionadas.map((categoria) => {
        const receitas = Recipes
          .filter((r) => r.id_categoria === categoria.id_categoria)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        return receitas.length > 0 ? { categoria, receitas } : null;
      }).filter(Boolean);

      setReceitasPorCategoria(receitasAgrupadas);
    }
  }, [categorias, Recipes]); // <- adicionamos dependências

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

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!receitasPorCategoria || receitasPorCategoria.length === 0) {
    return <p>Carregando receitas...</p>;
  }

  return (
    <div className={styles.mainContainer}>
      {/* Categorias aleatórias */}
      {receitasPorCategoria.map(({ categoria, receitas }) => (
        <section key={categoria.id_categoria} className={styles.recipesSection}>
          <h1 className={styles.categoryTitle}>{categoria.nome}</h1>
          <div className={styles.recipeGrid}>
            {receitas.map((receita) => (
              <div key={receita.id_receita} className={styles.recipeBox}>
                <Link href={`/pages/receita/${receita.id_receita}`} passHref>
                  <Image
                    src={receita.img_receita || "/images/layout/recipe/image-not-found.png"}
                    alt={receita.titulo_receita || 'Imagem da receita'}
                    width={350}
                    height={240}
                    className={styles.recipeImg}
                    priority
                  />
                </Link>
                <h2 className={styles.recipeTitle}>{receita.titulo_receita}</h2>
                <div className={styles.recipeDetails}>
                  <span>
                    <PiUserCircleFill size={24} className={styles.userIcon} aria-hidden="true" />
                    {receita.usuario.nome || "Nome do usuário"}
                  </span>
                  <span>
                    <TbCalendarTime size={24} className={styles.dateTimeIcon} aria-hidden="true" />{" "}
                    {formatMinutesToHours(receita.tempo_total)}
                  </span>
                  <span>
                    <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                    {formatMinutesToHours(receita.tempo_preparo)}
                  </span>
                  <span>
                    <TbCoin size={24} className={styles.CoinIcon} aria-hidden="true" />
                    {receita.custo ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(receita.custo) : "R$00,00"}
                  </span>
                  {receita.categoria && (
                    <span>
                      <FiBookmark size={20} className={styles.Icon} aria-hidden="true" />
                      {receita.categoria.nome}
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
      ))}

      {/* Seção Mais Receitas */}
      <MaisReceitasComponente limit={8} />
    </div>
  );
}
