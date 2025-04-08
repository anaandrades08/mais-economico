"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
            <div key={categoria.id} className={styles.categoriaTitle}>
             <Link href={`/pages/categoria/${categoria.id}`}>
                  <h3>{categoria.name}</h3>
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