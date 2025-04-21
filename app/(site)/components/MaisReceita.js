"use client";
import { useMemo, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Recipes} from "../data/RecipesData.js";
import styles from "../styles/Main.module.css";
//icones
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";


export default function MaisReceitasComponente({limit}) {
    //receitas aleatorias do mais receita
    const receitasAleatorias = useMemo(() => {
      return [...Recipes].sort(() => Math.random() - 0.5).slice(0, limit);
    }, []);

    return(
        <>
         {/* Seção Mais Receitas */}
              <section className={styles.recipesMoreSection}>
                <h1 className={styles.categoryTitle}>Mais Receitas</h1>
                <div className={styles.recipeMoreList}>
                  {/* ordenado pelos ultimos */}
                  {receitasAleatorias.map((recipe) => (
                    <div key={recipe.id} className={styles.recipeMoreItem}>
                      <Link href={`/pages/receita/${recipe.id}`} passHref>
                        <Image
                          src={recipe.image || "/images/layout/recipe/image-not-found.png"}
                          alt={recipe.nome || 'Imagem da receita'}
                          width={250}
                          height={200}
                          className={styles.recipeMoreImg}
                          priority={recipe.id < 4}
                        />
                      </Link>
                      <p className={styles.recipeMoreTitle}>{recipe.nome}</p>
                      <div className={styles.recipeMoreDetails}>
                        <p className={styles.recipeMoreIncos}>
                          <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                          {recipe.preparo || "00:00h"}
                        </p>
                        <p>
                          <TbCoin size={23} className={styles.CoinIcon} aria-hidden="true" />
                          {recipe.custo || "R$00,00"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
    </>
    );  
}