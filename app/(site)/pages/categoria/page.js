"use client";
import Link from "next/link";
import { useEffect, useState } from 'react';
import styles from "../../styles/Categoria.module.css";
import { FiArrowLeft } from 'react-icons/fi';

export default function TodasAsCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await fetch('/api/categorias');
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error('Erro ao carregar as categorias:', err);
        setError(err.message);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoria();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando as categorias...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar categorias: {error}</p>
        <Link href="/" className={styles.backButton}>
          <FiArrowLeft size={20} /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.AllcategoriesContainer}>
      <div className={styles.categoriaHeader}>
        <Link href="/" className={styles.backButton}>
          <FiArrowLeft size={20} /> Voltar
        </Link>
        <h1>Todas as Categorias</h1>
      </div>
      
      <div className={styles.categoriesList}>
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <div key={categoria.id_categoria} className={styles.categoryTitle}>
              <Link href={`/categoria/${categoria.id_categoria}`} passHref>
                <h3>{categoria.nome || "Não Especificado"}</h3>
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