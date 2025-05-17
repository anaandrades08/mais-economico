'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/Categoria.module.css'

import { GiCookingPot, GiSaucepan, GiCampCookingPot } from 'react-icons/gi'
import { FiArrowLeft, FiBookmark } from 'react-icons/fi'
import { TbCoin, TbCalendarTime } from "react-icons/tb"
import { PiUserCircleFill } from "react-icons/pi"
import { FaRegClock } from "react-icons/fa"

export default function CategoriaDetail() {
  const params = useParams()
  const [categoria, setCategoria] = useState(null)
  const [receitas, setReceitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaInvalida, setCategoriaInvalida] = useState(false)

  const [paginaAtual, setPaginaAtual] = useState(1)
  const receitasPorPagina = 6

  const getDifficultyIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'fácil': return <GiCookingPot size={22} className={styles.Icon} />
      case 'médio': return <GiSaucepan size={22} className={styles.Icon} />
      case 'difícil': return <GiCampCookingPot size={22} className={styles.Icon} />
      default: return <GiCookingPot size={22} className={styles.Icon} />
    }
  }

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        let res;
        if (params.id === '0') {
          // Consulta todas as receitas
          res = await fetch('/api/categorias/todasasreceitas/');
        } else {
          // Consulta receitas por categoria
          res = await fetch(`/api/categorias/receitas-ativas/${params.id}`);
        }

        if (!res.ok) {
          setCategoriaInvalida(true);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (params.id === '0') {
          setCategoria({ nome: 'Todas as Receitas' });
          setReceitas(data.receitas || []);
        } else {
          setCategoria(data.categoria);
          setReceitas(data.receitas || []);
        }
      } catch (err) {
        console.error('Erro ao carregar categoria:', err);
        setCategoriaInvalida(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [params.id]);

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  const nomeCategoria = categoria?.nome || "Todas as Receitas!"

  const indexInicial = (paginaAtual - 1) * receitasPorPagina
  const indexFinal = indexInicial + receitasPorPagina
  const receitasPaginadas = receitas.slice(indexInicial, indexFinal)
  const totalPaginas = Math.ceil(receitas.length / receitasPorPagina)

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina)
    window.scrollTo(0, 0)
  }

  return (
    <div className={styles.categoriaContainer}>
      <section className={styles.recipesSection}>
        <div className={styles.categoriaHeader}>
          <Link href="/" className={styles.backButton}>
            <FiArrowLeft size={20} className={styles.Icon} /> Voltar
          </Link>
          {categoriaInvalida && (
            <p className={styles.noCategory}>Categoria <span>{params.id}</span> não encontrada!</p>
          )}
          <h1 className={styles.categoraTitle}>{nomeCategoria}</h1>
          <p className={styles.recipeCount}>
            {receitas.length} {receitas.length === 1 ? 'receita' : 'receitas'} encontradas
          </p>
        </div>

        <div className={styles.recipeGrid}>
          {receitasPaginadas.length > 0 ? (
            receitasPaginadas.map((recipe) => (
              <div key={recipe.id_receita} className={styles.recipeBox}>
                <Link href={`/pages/receita/${recipe.id_receita}`}>
                  <Image
                    src={recipe.img_receita || "/images/layout/recipe/image-not-found.png"}
                    alt={recipe.titulo_receita || 'Imagem da receita'}
                    width={350}
                    height={240}
                    className={styles.recipeImg}
                  />
                </Link>
                <h2 className={styles.recipeTitle}>{recipe.titulo_receita || "Titulo da Receita"}</h2>
                <div className={styles.recipeDetails}>
                  <span><PiUserCircleFill size={24} className={styles.userIcon} />{recipe.usuario?.nome || "Nome do usuário"}</span>
                  <span><TbCalendarTime size={24} className={styles.dateTimeIcon} />{recipe.tempo_total || "00:00h"}</span>
                  <span><FaRegClock size={20} className={styles.TimeLineIcon} />{recipe.tempo_preparo || "00:00h"}</span>
                  <span>
                    <TbCoin size={24} className={styles.CoinIcon} />
                    {recipe.custo ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(recipe.custo): "R$00,00"}
                  </span>
                  {recipe.categoria?.nome && (
                  <span><FiBookmark size={24} className={styles.CoinIcon} />{recipe.categoria?.nome}</span>
                  )}
                  {recipe.dificuldade && (
                  <span>{getDifficultyIcon(recipe.dificuldade)}{recipe.dificuldade}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noRecipes}>
              <p>Nenhuma receita encontrada.</p>
              <Link href="/pages/categoria" className={styles.exploreLink}>
                Explorar outras categorias
              </Link>
            </div>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className={styles.pagination}>
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => mudarPagina(i + 1)}
                className={`${styles.pageButton} ${paginaAtual === i + 1 ? styles.paginaAtiva : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
