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

  return (
    <>
      <div className="searchResultsContainer">
        <p className='searchfrase'>Resultados de busca por: <strong>{busca}</strong></p>

        <div className="ResultsContainer">
          {results.length > 0 ? (
            <div className="resultsGrid">
              {results.map((recipe) => (
                <div key={recipe.id} className="recipeCard">
                  <Link href={`/pages/receita/${recipe.id}`}>
                    {recipe.image && (
                      <Image
                        src={recipe.image}
                        alt={recipe.nome}
                        width={350}
                        height={240}
                        className="recipeImage"
                        priority={results.length <= 3}
                      />
                    )}
                    <h2>{recipe.nome}</h2>
                    <div className="recipeDetails">
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
                  </Link>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="noResults">
              <FiMeh size={48} className='Icon' />
              <p>Nenhuma receita encontrada para {busca}</p>
              <Link href="/" className="backLink">
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
