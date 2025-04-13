'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/Categoria.module.css'
import { Recipes } from '../../../data/RecipesData'
import { categorias } from '../../../data/CategoriaData'

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
  let nomeCategoria = "Todas as Receitas"

  //valores de paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const receitasPorPagina = 6

  //grau de dificuldade da receita
  const getDifficultyIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'fácil': return <GiCookingPot size={22} className={styles.Icon} aria-hidden="true" />
      case 'médio': return <GiSaucepan size={22} className={styles.Icon} aria-hidden="true" />
      case 'difícil': return <GiCampCookingPot size={22} className={styles.Icon} aria-hidden="true" />
      default: return <GiCookingPot size={22} className={styles.Icon} aria-hidden="true" />
    }
  }

  useEffect(() => {
    const foundCategoria = categorias.find(
      (r) => r.id === params.id || r.id.toString() === params.id
    )

    if (!foundCategoria) {
      setReceitas(Recipes)
      //se categoria nao existe e não é exibe todas as receitas
      if (params.id != 0 && params.id != null) {
        setCategoriaInvalida(true)
      }
      setLoading(false)
      return
    }
    //se tem categoria a receita
    setCategoria(foundCategoria)
    const receitasDaCategoria = Recipes.filter(
      recipe => recipe.id_category === foundCategoria.id
    )
    setReceitas(receitasDaCategoria)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  //nome da categoria da receita
  if (categoria && categoria.name) {
    nomeCategoria = categoria.name
  }

  // Paginação lógica
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
              <div key={recipe.id} className={styles.recipeBox}>
                <Link href={`/pages/receita/${recipe.id}`}>
                  <Image
                    src={recipe.image || "/images/layout/recipe/image-not-found.png"}
                    alt={recipe.nome || 'Imagem da receita'}
                    width={350}
                    height={240}
                    className={styles.recipeImg}
                    priority={recipe.id < 4}
                  />
                </Link>
                <h2 className={styles.recipeTitle}>{recipe.nome || "Titulo da Receita"}</h2>
                <div className={styles.recipeDetails}>
                  <span><PiUserCircleFill size={24} className={styles.userIcon} />{recipe.usuario}</span>
                  <span><TbCalendarTime size={24} className={styles.dateTimeIcon} /> {recipe.tempo}</span>
                  <span><FaRegClock size={20} className={styles.TimeLineIcon} />{recipe.preparo}</span>
                  <span><TbCoin size={24} className={styles.CoinIcon} />{recipe.custo}</span>
                  {recipe.categoryTitle && (
                    <span><FiBookmark size={20} className={styles.Icon} />{recipe.categoryTitle}</span>
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

        {/* Paginação */}
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
