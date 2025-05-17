'use client'; 

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/Dicas.css'
//import { banners } from "../../data/DicasEspeciaisData.js";

export default function DicasEspeciais() {
  const [dicas, setDicas] = useState([]); // Para armazenar as dicas ativas
  const [error, setError] = useState(null); // Para capturar erros da requisição

// Carregar dicas ativas da API
    useEffect(() => {
        const fetchDicasAtivas = async () => {
            try {
                const response = await fetch('/api/dicas/dicas-ativas/'); // URL da API para buscar dicas ativas
                const data = await response.json();

                if (response.ok) {
                    setDicas(data); // Atualiza o estado com as dicas
                } else {
                    setError('Erro ao carregar dicas especiais');
                }
            } catch (error) {
                setError('Erro ao tentar carregar dicas especiais');
                console.error(error);
            }
        };

        fetchDicasAtivas(); // Chama a função assim que o componente monta
    }, []);



  //valores de paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const dicasPorPagina = 3

  // Paginação lógica
  const indexInicial = (paginaAtual - 1) * dicasPorPagina
  const indexFinal = indexInicial + dicasPorPagina
  const dicasPaginadas = dicas.slice(indexInicial, indexFinal)
  const totalPaginas = Math.ceil(dicas.length / dicasPorPagina)

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina)
    window.scrollTo(0, 0)
  }

  return (
    <div className="dicas-container">
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe erro caso haja */}
      < div className="dicas-container-text">
        <h2 className="dicas-title">Dicas Especiais</h2>
        <div className="dicasGrid">
          {dicasPaginadas.length > 0 && dicasPaginadas.map((dica) => (
            <>
              <div key={dica.id_dica} className='dicasBox'>
                <Link href={`/pages/categoria/${dica.id_categoria}`} passHref>
                  <Image
                    src={dica.img_dica}
                    alt={dica.titulo}
                    width={350}
                    height={240}
                    className='dicasImg'
                    priority
                  />
                </Link>
                <p className='dicas-description'>{dica.titulo} - {dica.descricao}</p>
                <p className='dicas-description'>
                  <Link href={`/pages/categoria/${dica.id_categoria}`} className='link-dica' passHref>
                    {dica.cta_text}
                  </Link>
                </p>
              </div>
            </>
          ))}          
        </div>
        {dicas.length > 0 && (
          <p className='total-dicas'>
            {dicas.length} {dicas.length === 1 ? 'dica' : 'dicas'} encontrada{dicas.length > 1 ? 's' : ''}
          </p>
        )}
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
      </div>
    </div >
  )

}