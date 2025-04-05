'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/RecipeDetail.module.css'
import { Recipes } from '../../../data/RecipesData'
import { GiCookingPot, GiSaucepan, GiFireBowl } from 'react-icons/gi';
import { FiClock, FiTag, FiUser, FiInfo } from 'react-icons/fi';


export default function RecipeDetail() {
  const params = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Encontra a receita pelo ID
    const foundRecipe = Recipes.find(
      r => r.id === params.id || r.id.toString() === params.id
    )
    setRecipe(foundRecipe)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!recipe) {
    return (
      <div className={styles.notFound}>
        <h2>Receita não encontrada!</h2>
        <Link href="/" className={styles.backLink}>
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.recipeContainer}>
      {/* Cabeçalho */}
      <div className={styles.recipeHeader}>
        <h1 className={styles.recipeTitle}>{recipe.name}</h1>
        <div className={styles.recipeMeta}>
          <span>
            <FiClock size={20} className={styles.icon} alt="Tempo" />
            {recipe.tempo || "Tempo não especificado"}
          </span>
          <span>
            <FiTag size={20} className={styles.icon} alt="Titulo" />
            {recipe.categoryTitle || "Categoria não especificada"}
          </span>
          <span>
            {recipe.dificuldade === 'Fácil' && <GiCookingPot size={20} />}
            {recipe.dificuldade === 'Médio' && <GiSaucepan size={20} />}
            {recipe.dificuldade === 'Difícil' && <GiFireBowl size={20} />}
            {recipe.dificuldade || "Não especificada"}
          </span>
          <span>
            <FiUser size={20} className={styles.icon} alt="Usuário" />
            {recipe.usuario || "Não Encontrado"}
          </span>
          {recipe.dica && (
            <span className={styles.tip}>
                <FiInfo size={18} />
                {recipe.dica}
            </span>
        )}
        </div>
      </div>

      {/* Imagem principal */}
      {recipe.image && (
        <div className={styles.recipeImageContainer}>
          <Image
            src={recipe.image}
            alt={recipe.name}
            width={800}
            height={450}
            className={styles.recipeImage}
            priority
          />
        </div>
      )}

      {/* Descrição */}
      {recipe.description && (
        <div className={styles.recipeDescription}>
          <p>{recipe.description}</p>
        </div>
      )}

      {/* Ingredientes e Modo de Preparo */}
      <div className={styles.recipeContent}>
        <div className={styles.ingredientsSection}>
          <h2>Ingredientes</h2>
          {recipe.ingredientes && <p>{recipe.ingredientes}</p>}
          <ul>
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className={styles.instructionsSection}>
          <h2>Modo de Preparo</h2>
          {recipe.modopreparo && <p>{recipe.modopreparo}</p>}
          <ol>
            {recipe.instructions?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className={styles.additionalInfo}>
        {recipe.rendimento && (
          <p>
            <strong>Rendimento:</strong> {recipe.rendimento}
          </p>
        )}
        {recipe.custo && (
          <p>
            <strong>Custo aproximado:</strong> {recipe.custo}
          </p>
        )}
      </div>

      {/* Botão de voltar */}
      <div className={styles.backButtonContainer}>
        <Link href="/receitas" className={styles.backButton}>
          Voltar para todas as receitas
        </Link>
      </div>
    </div>
  );
}