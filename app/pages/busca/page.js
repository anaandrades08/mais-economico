"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import styles from '../../styles/Search.module.css';
import { Recipes } from "../../data/RecipesData.js";
// Importação de ícones
import { FiClock, FiBookmark, FiSearch, FiMeh } from 'react-icons/fi';
import { GiCookingPot, GiSaucepan, GiCampCookingPot } from 'react-icons/gi';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const filtered = Recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query) ||
        (recipe.ingredientes && recipe.ingredientes.some(ing => ing.toLowerCase().includes(query))) ||
        (recipe.category && recipe.category.toLowerCase().includes(query))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Função para determinar o ícone de dificuldade
  const getDifficultyIcon = (level) => {
    switch(level?.toLowerCase()) {
      case 'fácil': return <GiCookingPot size={16} title="Fácil" />;
      case 'médio': return <GiSaucepan size={16} title="Médio" />;
      case 'difícil': return <GiCampCookingPot size={16} title="Difícil" />;
      default: return <GiCookingPot size={16} />;
    }
  };

  return (
    <div className={styles.searchResultsContainer}>
      <h1><FiSearch size={24} /> Você buscou por: {query}</h1>
      
      {results.length > 0 ? (
        <div className={styles.resultsGrid}>
          {results.map((recipe) => (
            <div key={recipe.id} className={styles.recipeCard}>
              <Link href={`./receita/${recipe.id}`}>
                {recipe.image && (
                  <div className={styles.imageContainer}>
                    <Image
                      src={recipe.image}
                      alt={recipe.name}
                      width={300}
                      height={200}
                      className={styles.recipeImage}
                      priority={results.length <= 3} // Prioriza carregamento para poucos resultados
                    />
                  </div>
                )}
                <h2>{recipe.name}</h2>
                <div className={styles.recipeDetails}>
                  <span>
                    <FiClock size={16} /> 
                    {recipe.tempo || 'Não especificado'}
                  </span>
                  <span>
                    <FiBookmark size={16} />
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
        <div className={styles.noResults}>
          <FiMeh size={48} />
          <p>Nenhuma receita encontrada para "{query}"</p>
          <Link href="/" className={styles.backLink}>
            Voltar para a página inicial
          </Link>
        </div>
      ) : (
        <p>Digite um termo para buscar receitas</p>
      )}
    </div>
  );
}