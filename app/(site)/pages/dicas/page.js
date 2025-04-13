'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import '../../styles/Dicas.css'
import { banners } from "../../data/DicasEspeciaisData.js";

export default function DicasEspeciais() {
  //valores de paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const dicasPorPagina = 3

  // Paginação lógica
  const indexInicial = (paginaAtual - 1) * dicasPorPagina
  const indexFinal = indexInicial + dicasPorPagina
  const dicasPaginadas = banners.slice(indexInicial, indexFinal)
  const totalPaginas = Math.ceil(banners.length / dicasPorPagina)

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina)
    window.scrollTo(0, 0)
  }

  return (
    <div className="dicas-container">
      < div className="dicas-container-text">
        <h2 className="dicas-title">Dicas Especiais</h2>
        <div className="dicasGrid">
          {dicasPaginadas.length > 0 && dicasPaginadas.map((dicas) => (
            <>
              <div key={dicas.id} className='dicasBox'>
                <Link href={`/pages/categoria/${dicas.categoria_id}`} passHref>
                  <Image
                    src={dicas.image}
                    alt={dicas.title}
                    width={350}
                    height={240}
                    className='dicasImg'
                    priority={dicas.id < 4}
                  />
                </Link>
                <p className='dicas-description'>{dicas.title} : {dicas.description}</p>
                <p className='dicas-description'>
                  <Link href={`/pages/categoria/${dicas.categoria_id}`} className='link-dica' passHref>
                    {dicas.ctaText}
                  </Link>
                </p>
              </div>
            </>
          ))}          
        </div>
        {banners.length > 0 && (
          <p className='total-dicas'>
            {banners.length} {banners.length === 1 ? 'dica' : 'dicas'} encontrada{banners.length > 1 ? 's' : ''}
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