'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/Categoria.module.css'
import { Recipes } from '../../../data/RecipesData'
import { categorias } from '../../../data/CategoriaData'

import { GiCookingPot, GiSaucepan, GiFireBowl } from 'react-icons/gi'
import { FiClock, FiArrowLeft, FiBookmark } from 'react-icons/fi'
import { TbCoin } from "react-icons/tb";
import { TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";

export default function CategoriaDetail() {
  const params = useParams()
  const [categoria, setCategoria] = useState(null)
  const [receitas, setReceitas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Encontra a categoria pelo ID
    const foundCategoria = categorias.find(
      r => r.id === params.id || r.id.toString() === params.id
    )
    setCategoria(foundCategoria)

    // Filtra receitas da categoria
    if (foundCategoria) {
      const receitasDaCategoria = Recipes.filter(
        recipe => recipe.id_category === foundCategoria.id
      )
      setReceitas(receitasDaCategoria)
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (categoria.id === 0 || categoria.id === null) {
    return (
      <div className={styles.categoriaContainer}>
        {/* Cabeçalho  de todas as receitas*/}
        <div className={styles.categoriaHeader}>
          <Link href="/" className={styles.backButton}>
            <FiArrowLeft size={20} /> Voltar
          </Link>
          <h1 className={styles.categoriaTitle}>{categoria.name}</h1>
          <p className={styles.recipeCount}>
            {Recipes.length} {Recipes.length === 1 ? 'receita' : 'receitas'} encontradas
          </p>
        </div>

        {/* Lista de Todas as Receitas */}
        <div className={styles.recipesGrid}>
          {Recipes.length > 0 ? (
            Recipes.map((recipe) => (
              <div key={recipe.id} className={styles.recipeCard}>
                <Link href={`/pages/receita/${recipe.id}`}>
                  {recipe.image && (
                    <div className={styles.imageContainer}>
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        width={300}
                        height={200}
                        className={styles.recipeImage}
                      />
                    </div>
                  )}
                  <div className={styles.recipeInfo}>
                    <h3>{recipe.nome}</h3>
                    <div className={styles.recipeMeta}>
                      <span>
                        <PiUserCircleFill size={24} className='Icon' alt="Nome do usuário" />
                        {recipe.usuario || "Nome do usuário"}
                      </span>
                      <span>
                        <TbCalendarTime size={24} className='Icon' alt="Tempo de preparo" />{" "}
                        {recipe.tempo || "00:00h"}
                      </span>
                      <span>
                        <FiClock size={20} className='Icon' alt="Tempo cozinhando" />
                        {recipe.preparo || 'Não especificado'}
                      </span>
                      <span>
                        <TbCoin size={24} className='Icon' alt="Custo" />
                        {recipe.custo || "R$00,00"}
                      </span>
                      <span>
                        <FiBookmark size={20} className='Icon' />
                        {recipe.categoryTitle || 'Geral'}
                      </span>
                      {recipe.dificuldade && (
                        <span>
                          {getDifficultyIcon(recipe.dificuldade)}
                          {recipe.dificuldade}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
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
      </div>
    )
  }
  else {
    return (
      <div className={styles.categoriaContainer}>
        {/* Cabeçalho */}
        <div className={styles.categoriaHeader}>
          <Link href="/" className={styles.backButton}>
            <FiArrowLeft size={20} /> Voltar
          </Link>
          <h1 className={styles.categoriaTitle}>{categoria.name}</h1>
          <p className={styles.recipeCount}>
            {receitas.length} {receitas.length === 1 ? 'receita' : 'receitas'} encontradas
          </p>
        </div>

        {/* Lista de Receitas */}
        <div className={styles.recipesGrid}>
          {receitas.length > 0 ? (
            receitas.map((recipe) => (
              <div key={recipe.id} className={styles.recipeCard}>
                <Link href={`/pages/receita/${recipe.id}`}>
                  {recipe.image && (
                    <div className={styles.imageContainer}>
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        width={300}
                        height={200}
                        className={styles.recipeImage}
                      />
                    </div>
                  )}
                  <div className={styles.recipeInfo}>
                    <h3>{recipe.nome}</h3>
                    <div className={styles.recipeMeta}>
                      <span>
                        <FiClock size={16} />
                        {recipe.tempo || 'Não especificado'}
                      </span>
                      <span>
                        {recipe.dificuldade === 'Fácil' && <GiCookingPot size={16} />}
                        {recipe.dificuldade === 'Médio' && <GiSaucepan size={16} />}
                        {recipe.dificuldade === 'Difícil' && <GiFireBowl size={16} />}
                        {recipe.dificuldade || 'Não especificada'}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className={styles.noRecipes}>
              <p>Nenhuma receita encontrada nesta categoria.</p>
              <Link href="/pages/categoria" className={styles.exploreLink}>
                Explorar outras categorias
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }
}