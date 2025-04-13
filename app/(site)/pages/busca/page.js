'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Recipes } from "../../data/RecipesData.js";
import { FiClock, FiBookmark, FiMeh } from 'react-icons/fi';
import { GiCookingPot, GiSaucepan, GiCampCookingPot } from 'react-icons/gi';
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";
import '../../styles/Search.css';


function SearchContent() {
  const searchParams = useSearchParams();
  const busca = searchParams.get('q');
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [results, setResults] = useState([]);

  //valores de paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const receitasPorPagina = 8

  useEffect(() => {
    if (query) {
      const filtered = Recipes.filter(recipe =>
        recipe.nome?.toLowerCase().includes(query) ||
        (Array.isArray(recipe.ingredientes) &&
          recipe.ingredientes.some(ing =>
            (typeof ing === 'string' && ing.toLowerCase().includes(query)) ||
            (ing?.nome && ing.nome.toLowerCase().includes(query))
          )
        ) ||
        recipe.category?.toLowerCase().includes(query)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const getDifficultyIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'fácil': return <GiCookingPot size={20} title="Fácil" className='Icon' />;
      case 'médio': return <GiSaucepan size={20} title="Médio" className='Icon' />;
      case 'difícil': return <GiCampCookingPot size={20} title="Difícil" className='Icon' />;
      default: return <GiCookingPot size={20} className='Icon' />;
    }
  };

  // Paginação lógica
  const indexInicial = (paginaAtual - 1) * receitasPorPagina
  const indexFinal = indexInicial + receitasPorPagina
  const receitasPaginadas = results.slice(indexInicial, indexFinal)
  const totalPaginas = Math.ceil(results.length / receitasPorPagina)

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="searchResultsContainer">
        <p className='searchfrase'>Resultados de busca por: <strong>{busca}</strong></p>
        <p className='searchcount'>{results.length} receitas encontradas</p>
        <div className="ResultsContainer">
          {receitasPaginadas.length > 0 ? (
            <>
              <div className="resultsGrid">
                {receitasPaginadas.map((recipe) => (
                  <div key={recipe.id} className="recipeCard">
                    <Link href={`/pages/receita/${recipe.id}`} passHref>
                      {recipe.image && (
                        <Image
                          src={recipe.image || "/images/layout/recipe/image-not-found.png"}
                          alt={recipe.nome || 'Imagem da receita'}
                          width={350}
                          height={240}
                          className="recipeImage"
                          priority={results.length <= 3}
                        />
                      )}
                      <h2 className='recipeTitle'>{recipe.nome}</h2>
                      <div className="recipeDetails">
                        <span>
                          <PiUserCircleFill size={24} className='Icon' />
                          {recipe.usuario || "Nome do usuário"}
                        </span>
                        <span>
                          <TbCalendarTime size={24} className='Icon' />{" "}
                          {recipe.tempo || "00:00h"}
                        </span>
                        <span>
                          <FiClock size={20} className='Icon' />
                          {recipe.preparo || '00:00h'}
                        </span>
                        <span>
                          <TbCoin size={24} className='Icon' />
                          {recipe.custo || "R$00,00"}
                        </span>
                        {recipe.categoryTitle && (
                          <span>
                            <FiBookmark size={20} className='Icon' />
                            {recipe.categoryTitle}
                          </span>
                        )}
                        {recipe.dificuldade && (
                          <span>
                            {getDifficultyIcon(recipe.dificuldade)}
                            {recipe.dificuldade}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="pagination">
                  {[...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => mudarPagina(i + 1)}
                      className={`page-button ${paginaAtual === i + 1 ? 'pagina-ativa' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : query ? (
            <div className="noResults">
              <FiMeh size={48} className='Icon' />
              <p>Nenhuma receita encontrada para {busca}</p>
              <Link href="/" className="backLink" passHref>
                Voltar para a página inicial
              </Link>
            </div>

          ) : (
            <p>Digite um termo para buscar receitas</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="searchResultsContainer">
        <p>Carregando resultados...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
