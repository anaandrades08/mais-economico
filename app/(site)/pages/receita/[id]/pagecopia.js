"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from "next/image";
import Link from 'next/link'
import '../../../styles/RecipeDetail.css'
import MaisReceitasComponente from '../../../components/MaisReceita';
//importa dados
import { Recipes, moreRecipes } from '../../../data/RecipesData'
import { FeedBacks } from '../../../data/FeedbackData'
import { listaIngredientesaSubstituicoes } from '../../../data/IngredientesData'

//componentes
import RecipeBanner from '../../../components/RecipeBanner'
import StarRating from '../../../components/StarRating'
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
  const [original, setOriginal] = useState('')
  const [substituto, setSubstituto] = useState('')
  const [valorOriginal, setValorOriginal] = useState(0)
  const [valorSubstituto, setValorSubstituto] = useState(0)
  const [diferenca, setDiferenca] = useState(null)

  const handleCalcular = () => {
    const itemOriginal = listaIngredientesaSubstituicoes.find(item => item.titulo === original)
    const itemSubstituto = listaIngredientesaSubstituicoes.find(item => item.titulo === substituto)

    if (itemOriginal && itemSubstituto) {
      setValorOriginal(itemOriginal.valor)
      setValorSubstituto(itemSubstituto.valor)
      setDiferenca(itemOriginal.valor - itemSubstituto.valor)
    }
  }

  useEffect(() => {
    // Encontra a receita pelo ID
    const foundRecipe = Recipes.find(
      r => r.id === params.id || r.id.toString() === params.id
    )
    setRecipe(foundRecipe)
    setLoading(false)
    setDiferenca(null)
    setValorSubstituto(0)
  }, [params.id, original, substituto])

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
          {/*---------------------------------------- Primeira Coluna --------------------------------------*/}
          <div className="column">
            {/* Descrição */}

            <div className="descricaoContainer">
              {recipe.descricao ? (
                <>
                  <h2 className="sectionTitle">DESCRIÇÃO</h2>
                  <div className="recipeDescription">
                    <p>{recipe.descricao}</p>
                  </div>
                </>
              ) : (
                <p className="semDescricao">Essa receita ainda não tem descrição 😕</p>
              )}
            </div>
            {/* Rendimento */}
            <div className="rendimentoContainer">
              {recipe.rendimento ? (
                <>
                  <h2 className="sectionTitle">RENDIMENTO</h2>
                  <p>{recipe.rendimento}</p>
                </>
              ) : (
                <p className="semDescricao">Não especificado</p>
              )}
            </div>

            {/* Ingredientes */}
            <div className="ingredientesContainer">
              {(recipe.ingredientes || recipe.ingredients?.length > 0) ? (
                <>
                  <h2 className="sectionTitle">INGREDIENTES</h2>
                  {recipe.ingredientes.map((grupo, index) => (
                    <div key={index}>
                      <h3>{grupo.titulo}</h3>
                      <ul>
                        {grupo.itens.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              ) : (
                <p className="semDescricao">Essa receita ainda não tem ingredientes 😕</p>
              )}
            </div>
          </div>

          {/* ----------------------Segunda Coluna------------------------- */}

          <div className="column">

            {/* Custo */}
            <div className="custoContainer">
              {recipe.custo ? (
                <>
                  <h2 className="sectionTitle">CUSTO DA RECEITA</h2>
                  {/* Bloco em linha */}
                  <div className="detailInline">
                    <p className="detailIcon">
                      <TbCoin size={23} className="IconContainer" alt="Custo" />
                    </p>
                    <p className="custoLabel">Custo:</p>
                    <p className="custoValor">{recipe.custo}</p>
                  </div>
                </>
              ) : (
                <p className="semDescricao">Essa receita ainda não tem custo 😕</p>
              )}
            </div>

            {/* Substituições */}
            <div className="substituicoesContainer">
              <h2 className="sectionTitle">SUBSTITUIÇÃO</h2>
              <div>

                <select className="SelectAlimento" onChange={e => setOriginal(e.target.value)}>
                  <option value="">🍴 Alimento</option>
                  {[...listaIngredientesaSubstituicoes]
                    .sort((a, b) => a.titulo.localeCompare(b.titulo))
                    .map((item) => (
                      <option key={item.id} value={item.titulo}>
                        🍴 {item.titulo}
                      </option>
                    ))}
                </select>

                <button className='btnRplace' onClick={handleCalcular}>
                  <TbReplaceFilled size={24} alt="Substitui ingrediente" />
                </button>

                <select className="SelectSubtistuicao" onChange={e => setSubstituto(e.target.value)}>
                  <option value="">🍴 Substituto</option>
                  {[...listaIngredientesaSubstituicoes]
                    .sort((a, b) => a.titulo.localeCompare(b.titulo))
                    .map((item) => (
                      <option key={item.id} value={item.titulo}>
                        🍴 {item.titulo}
                      </option>
                    ))}
                </select>

                <span className='Icon'>
                  <FaEquals size={18} alt="retorna resultado " />
                </span>
              </div>
              <div className="valor">
                <p className="icon">
                  <TbCoin size={23} className="IconContainer" />
                </p>
                <p className='ValorText'>Valor:</p>
                <p>R${valorSubstituto.toFixed(2)}</p>
              </div>

              {diferenca !== null && (
                <p>
                  {diferenca > 0
                    ? `Produto R$${diferenca.toFixed(2)} mais barato que o original da receita.`
                    : diferenca < 0
                      ? `Produto R$${Math.abs(diferenca).toFixed(2)} mais caro que o original da receita.`
                      : 'Produto com mesmo valor do original.'}
                </p>
              )}
            </div>


            {/* Substituições Realizadas*/}
            <div className="substituicoesContainer">
              {recipe.substituicoes?.filter(
                (item) => item.ingrediente && Array.isArray(item.substituicoes)
              ).length > 0 ? (
                <>
                  <h2 className="sectionTitle">SUBSTITUIÇÕES REALIZADAS</h2>
                  <ul>
                    {recipe.substituicoes
                      .filter(
                        (item) => item.ingrediente && Array.isArray(item.substituicoes)
                      )
                      .map((item, index) => (
                        <li key={index}>
                          <p>
                            {item.ingrediente} por: {item.substituicoes.join(", ")}
                          </p>
                        </li>
                      ))}
                  </ul>
                </>
              ) : (
                <p className="semDescricao">
                  Essa receita ainda não tem substituições 😕
                </p>
              )}
            </div>


            {/* Modo de Preparo */}
            <div className="preparoContainer">
              {Array.isArray(recipe.mododepreparo) && recipe.mododepreparo.length > 0 ? (
                <>
                  <h2 className="sectionTitle">MODO DE PREPARO</h2>

                  {/* Bloco em linha */}
                  <div className="detailInline">
                    <p className="detailIcon">
                      <FaRegClock size={20} className="IconContainer" />
                    </p>
                    <p className="custoLabel">Tempo de Preparo:</p>
                    <p className="custoValor">{recipe.preparo || "Não informado"}</p>
                  </div>

                  {recipe.mododepreparo.map((grupo, index) => (
                    <div key={index}>
                      <h3>{grupo.titulo || `Etapa ${index + 1}`}</h3>
                      <ul>
                        {Array.isArray(grupo.passos) && grupo.passos.length > 0 ? (
                          grupo.passos.map((item, idx) => (
                            <li key={idx}>
                              <span>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. </span>
                              {item}
                            </li>
                          ))
                        ) : (
                          <li>Sem passos informados</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </>
              ) : (
                <p className="semDescricao">Essa receita ainda não tem modo de preparo 😕</p>
              )}
            </div>
          </div>
        </div>

        {/* Recomendações---------------------------------------- */}
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
                      <PiUserCircleFill size={20} className="iconUserfeedback" /> {feedback.usuario}
                    </p>
                    <p className="recommendation-feedbacks-text">{feedback.mensagem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mais Receitas----------------------------------------------------------------------------- */}
        <div>
          {/* Mais Receitas Componentes */}
          <MaisReceitasComponente limit={4} />
        </div>

        {/* Fecha ultimo div */}
      </div>
    </>
  );
}