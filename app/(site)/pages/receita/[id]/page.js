'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from "next/image";
import Link from 'next/link'
import '../../../styles/RecipeDetail.css'

//importa dados
import { Recipes, moreRecipes } from '../../../data/RecipesData'
import { FeedBacks } from '../../../data/FeedbackData'
import { listaIngredientes } from '../../../data/IngredientesData'

//componentes
import RecipeBanner from '@/app/(site)/components/RecipeBanner'
import StarRating from '@/app/(site)/components/StarRating'
//react-icon
import { PiUserCircleFill } from "react-icons/pi";
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbReplaceFilled } from "react-icons/tb";
import { FaEquals } from 'react-icons/fa';

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
    return <div className="loading">Carregando...</div>
  }

  if (!recipe) {
    return (
      <div className="notFound">
        <h2>Receita não encontrada!</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }
  //ultimos 3 feedbacks
  const ultimosFeedbacks = [...FeedBacks]
    .sort((a, b) => new Date(b.datacadastro) - new Date(a.datacadastro))
    .slice(0, 3);


  return (
    <>
      <RecipeBanner recipe={recipe} />
      <div className="recipeContainer">

        <div className="recipeContentTwoColumns">
          {/* Primeira Coluna */}
          <div className="column">
            {/* Descrição */}
            {recipe.descricao && (
              <>
                <h2 className="sectionTitle">DESCRIÇÃO</h2>
                <div className="recipeDescription">
                  <p>{recipe.descricao}</p>
                </div>
              </>
            )}
            {/* Rendimento */}
            {recipe.rendimento && (
              <>
                <h2 className="sectionTitle">RENDIMENTO</h2>
                <p>{recipe.rendimento}</p>
              </>
            )}
            {/* Ingredientes */}
            {(recipe.ingredientes || recipe.ingredients?.length > 0) && (
              <>
                <h2 className="sectionTitle">INGREDIENTES</h2>
                {recipe.ingredientes.map((grupo, index) => (
                  <div key={index}>
                    <h3>{grupo.titulo}</h3>
                    <ul>
                      {grupo.itens.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}

          </div>

          {/* ----------------------Segunda Coluna------------------------- */}

          <div className="column">

            {/* Custo */}
            {recipe.custo && (
              <>
                <h2 className="sectionTitle">CUSTO DA RECEITA</h2>
                {/* Bloco em linha */}
                <div className="custoInline">
                  <p className="custoIcon">
                    <TbCoin size={23} className="IconContainer" alt="Custo" />
                  </p>
                  <p className="custoLabel">Custo:</p>
                  <p className="custoValor">{recipe.custo}</p>
                </div>
              </>
            )}


            {/* Substituições */}
            <div className="substituicoesContainer">
              <h2 className="sectionTitle">SUBSTITUIÇÃO</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>

                <select className="SelectAlimento">
                  <option value="">🍴 Alimento 1</option> {/* ou "Selecione um ingrediente..." */} 
                  {listaIngredientes.map((item) => (
                    <option key={item.id}>🍴 {item.titulo}</option>
                  ))}
                </select>

                <span>
                  <TbReplaceFilled size={24} className="SwapIcon" alt="Substituir" />
                </span>

                <select className="SelectSubtistuicao">
                  <option value="">🍴 Alimento 1</option> {/* ou "Selecione um ingrediente..." */}
                  {listaIngredientes.map((item) => (
                    <option key={item.id}>🍴 {item.titulo}</option>
                  ))}
                </select>

                <span className='Icon'>
                  <FaEquals size={18} />
                </span>

                <div className="valor">
                  <p className="icon">
                    <TbCoin size={23} className="IconContainer" alt="Custo" />
                  </p>
                  <p className='ValorText'>Valor:</p>
                  <p> R$10,00</p>
                </div>
              </div>

              <p>Produto 10% mais barato que o original da receita.</p>
            </div>


            {/* Substituições Realizadas*/}
            {recipe.substituicoes?.length > 0 && (
              <>
                <h2 className="sectionTitle">SUBSTITUIÇÕES REALIZADAS</h2>
                <ul>
                  {recipe.substituicoes.map((item, index) => (
                    <li key={index}>
                      <strong>{item.ingrediente}:</strong> {item.substituicoes.join(", ")}
                    </li>
                  ))}
                </ul>
              </>
            )}


            {/* Modo de Preparo */}
            {(recipe.mododepreparo || recipe.mododepreparo?.length > 0) && (
              <>
                <h2 className="sectionTitle">Modo de Preparo</h2>
                {recipe.mododepreparo.map((grupo, index) => (
                  <div key={index}>
                    <h3>{grupo.titulo}</h3>
                    <ul>
                      {grupo.passos.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Recomendações */}
        <div className="reciperecommendations">
          <h3>Recomendações dos Usuários</h3>
          <p>Você possui alguma recomendação de substituição de ingredientes? <Link href="/login" className="reciperecommendationsLink">Faça login</Link> e escreva para gente.</p>
          <div className='recommendations-itens'>
            <div className="recommendations-columns">
              {/* Coluna Esquerda: formulário */}
              <div className="recommendation-form">
                <div className="rating-label">
                  <StarRating totalStars={5} />
                  <span>Avalie</span>
                </div>
                <div className="recommendation-form-text">
                  <textarea placeholder="Escreva aqui sua recomendação..." />
                  <p>Por gentileza, envie somente sugestões e avaliações das receitas.</p>
                </div>
                <div className="recommendation-form-button">
                  <button>Enviar</button>
                </div>
              </div>

              {/* Coluna Direita: exemplo de feedbacks */}
              <div className="recommendation-feedbacks">
                {ultimosFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="recommendation-feedbacks-users">
                    <p className="recommendation-feedbacks-usuario">
                      <PiUserCircleFill size={20} className="iconUserfeedback" alt={`Usuário ${feedback.usuario}`} /> {feedback.usuario}
                    </p>
                    <p className="recommendation-feedbacks-text">{feedback.mensagem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mais Receitas */}
        <div className="more-recipes-container">
          <h3>Mais Receitas</h3>
          <div className="recipes-grid">
            {moreRecipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id} className="recipe-item">
                <Link href={`/pages/receita/${recipe.id}`} passHref legacyBehavior>
                  <a>
                    <Image
                      src={recipe.image}
                      alt={recipe.nome}
                      width={300}
                      height={200}
                      className="recipe-more-img"
                      priority={recipe.id < 4}
                    />
                  </a>
                </Link>
                <p className="recipe-more-title">{recipe.nome}</p>
                <div className="recipe-more-details">
                  <div className="detail-line">
                    <p className="recipe-more-icons">
                      <FaRegClock size={20} className="timeline-icon" alt="Tempo cozinhando" /> Preparo:
                    </p>
                    <p>{recipe.preparo || "00:00h"}</p>
                  </div>
                  <div className="detail-line">
                    <p className="recipe-more-icons">
                      <TbCoin size={23} className="coin-icon" alt="Custo" /> Custo:
                    </p>
                    <p>{recipe.custo || "R$00,00"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fecha ultimo div */}
      </div>
    </>
  );
}