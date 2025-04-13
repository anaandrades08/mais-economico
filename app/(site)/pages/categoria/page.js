"use client";
import Link from "next/link";
import styles from "../../styles/Categoria.module.css";
import { categorias } from "../../data/CategoriaData";
import { FiArrowLeft } from 'react-icons/fi'

export default function CategoriaDetail() {
  return (
    <div className={styles.AllcategoriesContainer}>
       <div className={styles.categoriaHeader}>
        <Link href="/" className={styles.backButton}>
          <FiArrowLeft size={20} /> Voltar
        </Link>
        <h1>Todas as Categorias</h1>
        {categorias.length > 0 ? (
            categorias.map((categoria) => (
            <div key={categoria.id} className={styles.categoryTitle}>
             <Link href={`/pages/categoria/${categoria.id}`} passHref>
                  <h3>{categoria.name || "Não Especificado"}</h3>
                </Link>
            </div>
            ))
        ) : (
        <div className={styles.noCategorias}>
          <p>Nenhuma categoria encontrada.</p>
          <Link href="/" className={styles.exploreLink}>
            Voltar para a página inicial
          </Link>
        </div>
      )}
        </div>
    </div>
  );
}