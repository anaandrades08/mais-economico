'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { FiClock, FiBookmark, FiMeh } from 'react-icons/fi';
import { GiCookingPot, GiSaucepan, GiCampCookingPot } from 'react-icons/gi';
import { TbCoin, TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";
import '../../styles/Search.css';

function SearchContent() {
  const searchParams = useSearchParams();
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const busca = searchParams.get('q');
  const query = busca?.toLowerCase() || '';
  const [results, setResults] = useState([]);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const receitasPorPagina = 8;

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/receitas/busca');
        if (!res.ok) throw new Error('Erro ao buscar receitas');
        const data = await res.json();

        const receitasAtivas = data.receitas || [];
        setReceitas(receitasAtivas);

        if (query) {
          const filtered = receitasAtivas.filter(recipe => {
            const termo = query.toLowerCase();

            const titulo = recipe.titulo_receita?.toLowerCase().includes(termo);
            const categoria = recipe.categoria?.nome?.toLowerCase().includes(termo);
            const usuario = recipe.usuario?.nome?.toLowerCase().includes(termo);

            const ingredientes = recipe.titulosIngrediente?.some(ti =>
              ti.ingredientes?.some(ing =>
                ing.ingrediente?.descricao_ingrediente?.toLowerCase().includes(termo)
              )
            );

            return titulo || categoria || usuario || ingredientes;
          });

          setResults(filtered);
        } else {
          setResults(receitasAtivas);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchAndFilter, 300);
    return () => clearTimeout(delay);
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
  const indexInicial = (paginaAtual - 1) * receitasPorPagina;
  const indexFinal = indexInicial + receitasPorPagina;
  const receitasPaginadas = results.slice(indexInicial, indexFinal);
  const totalPaginas = Math.ceil(results.length / receitasPorPagina);

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
    window.scrollTo(0, 0);
  };
  function formataData(data) {
    if (!data) return "Data não informada";

    const dataObj = new Date(data);

    if (isNaN(dataObj.getTime())) return "Data inválida";

    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  function formatMinutesToHours(minutes) {
    if (!minutes && minutes !== 0) return "Não informado";

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
  return (
    <div className="searchResultsContainer">
      <p className='searchfrase'>Resultados de busca por: <strong>{busca}</strong></p>
        {results.length > 0 ? 
        <p className='searchcount'>
          {results.length} {results.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
        </p>
        : <p className='searchcount'>0 receita encontrada</p>}
      {error && <p className="error">{error}</p>}
      <div className="ResultsContainer">
        {loading ? (
          <p>Carregando a busca de receitas...</p>
        ) : receitasPaginadas.length > 0 ? (
          <>
            <div className="resultsGrid">
              {receitasPaginadas.map((recipe) => (
                <div key={recipe.id_receita} className="recipeCard">
                  <Link href={`/pages/receita/${recipe.id_receita}`} passHref>
                    {recipe.img_receita && (
                      <Image
                        src={recipe.img_receita || "/images/layout/recipe/image-not-found.png"}
                        alt={recipe.titulo_receita || 'Imagem da receita'}
                        width={350}
                        height={240}
                        className="recipeImage"
                        priority
                      />
                    )}
                    <h2 className='recipeTitle'>{recipe.titulo_receita}</h2>
                    <div className="recipeDetails">
                      <span>
                        <PiUserCircleFill size={24} className='Icon' />
                        {recipe.usuario?.nome || "Usuário"}
                      </span>
                      <span>
                        <TbCalendarTime size={24} className='Icon' />
                        {formataData(recipe.data_cadastro)}
                      </span>
                      <span>
                        <FiClock size={20} className='Icon' />
                        {formatMinutesToHours(recipe.tempo_preparo)}
                      </span>
                      <span>
                        <TbCoin size={24} className='Icon' />
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(recipe.custo) || "R$00,00"}
                      </span>
                      {recipe.categoria?.nome && (
                        <span>
                          <FiBookmark size={20} className='Icon' />
                          {recipe.categoria.nome}
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
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="searchResultsContainer">
        <p>Carregando resultados da busca...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}