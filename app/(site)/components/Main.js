import styles from "../styles/Main.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  moreRecipes,
  Recipes,
  recipesByCategory,
} from "../data/RecipesData.js";
import RecipeSection from "./RecipeSection.js";


import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";
import { FiClock, FiBookmark, FiSearch, FiMeh } from 'react-icons/fi';
import { GiCookingPot, GiSaucepan, GiCampCookingPot } from 'react-icons/gi';

const getDifficultyIcon = (level) => {
  switch(level?.toLowerCase()) {
    case 'fácil': return <GiCookingPot size={22} alt="Fácil" className={styles.Icon} aria-hidden="true" />;
    case 'médio': return <GiSaucepan size={22} alt="Médio"  className={styles.Icon} aria-hidden="true" />;
    case 'difícil': return <GiCampCookingPot size={22} alt="Difícil" className={styles.Icon} aria-hidden="true" />;
    default: return <GiCookingPot size={22}  className={styles.Icon} aria-hidden="true" />;
  }
};

export default function MainContent() {
  return (

    
    <div className={styles.mainContainer}>

      {/* Seção Category Bolos e tortas */}
      <section className={styles.recipesSection}>
        <h1 className={styles.categoryTitle}>Bolos e Tortas</h1>
        <div className={styles.recipeGrid}>
          {recipesByCategory.bolosetortas.slice(0, 3).map((recipe) => (
            <div key={recipe.id} className={styles.recipeBox}>
              <Link href={`/pages/receita/${recipe.id}`} passHref legacyBehavior>
                <a>
                  <Image
                    src={recipe.image}
                    alt={recipe.nome}
                    width={350}
                    height={240}
                    className={styles.recipeImg}
                    priority={recipe.id < 4}
                  />
                </a>
              </Link>
              <h2 className={styles.recipeTitle}>{recipe.nome}</h2>
              <div className={styles.recipeDetails}>
                <span>
                <PiUserCircleFill size={24} className={styles.userIcon} aria-hidden="true" />
                  {recipe.usuario || "Nome do usuário"}
                </span>
                <span>
                  <TbCalendarTime size={24} className={styles.dateTimeIcon} aria-hidden="true" />{" "}
                  {recipe.tempo || "00:00h"}
                </span>
                <span>
                  <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                  {recipe.preparo || "00:00h"}
                </span>
                <span>
                  <TbCoin size={24} className={styles.CoinIcon} aria-hidden="true" />
                  {recipe.custo || "R$00,00"}
                </span>
                <span>
                    <FiBookmark size={20} className={styles.Icon} aria-hidden="true" />
                    {recipe.categoryTitle || 'Geral'}
                  </span>
                  {recipe.dificuldade && (
                    <span>
                      {getDifficultyIcon(recipe.dificuldade)}
                      {recipe.dificuldade}
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Seção Category massas */}

      <section className={styles.recipesSection}>
        <h1 className={styles.categoryTitle}>Massas</h1>
        <div className={styles.recipeGrid}>
          {recipesByCategory.massas.slice(0, 3).map((recipe) => (
            <div key={recipe.id} className={styles.recipeBox}>
              <Link href={`/pages/receita/${recipe.id}`} passHref legacyBehavior>
                <a>
                  <Image
                    src={recipe.image}
                    alt={recipe.nome}
                    width={350}
                    height={240}
                    className={styles.recipeImg}
                    priority={recipe.id < 4}
                  />
                </a>
              </Link>
              <h2 className={styles.recipeTitle}>{recipe.nome}</h2>
              <div className={styles.recipeDetails}>
              <span>
                  <PiUserCircleFill size={24} className={styles.userIcon} aria-hidden="true" />
                  {recipe.usuario || "Nome do usuário"}
                </span>
                <span>
                  <TbCalendarTime size={24} className={styles.dateTimeIcon} aria-hidden="true" />{" "}
                  {recipe.tempo || "00:00h"}
                </span>
                <span>
                  <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                  {recipe.preparo || "00:00h"}
                </span>
                <span>
                  <TbCoin size={24} className={styles.CoinIcon} aria-hidden="true" />
                  {recipe.custo || "R$00,00"}
                </span>
                <span>
                    <FiBookmark size={20} className={styles.Icon} aria-hidden="true" />
                    {recipe.categoryTitle || 'Geral'}
                  </span>
                  {recipe.dificuldade && (
                    <span>
                      {getDifficultyIcon(recipe.dificuldade)}
                      {recipe.dificuldade}
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Mais Receitas */}
      <section className={styles.recipesMoreSection}>
        <h1 className={styles.categoryTitle}>Mais Receitas</h1>
        <div className={styles.recipeMoreList}>
          {moreRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeMoreItem}>
              <Link href={`/pages/receita/${recipe.id}`} passHref legacyBehavior>
                <a>
                  <Image
                    src={recipe.image}
                    alt={recipe.nome}
                    width={250}
                    height={200}
                    className={styles.recipeMoreImg}
                    priority={recipe.id < 4}
                  />
                </a>
              </Link>
              <p className={styles.recipeMoreTitle}>{recipe.nome}</p>
              <div className={styles.recipeMoreDetails}>
                <p className={styles.recipeMoreIncos}>
                  {" "}
                  <FaRegClock size={20} className={styles.TimeLineIcon} aria-hidden="true" />
                  {recipe.preparo || "00:00h"}
                </p>
                <p>
                  {" "}
                  <TbCoin size={23} className={styles.CoinIcon} aria-hidden="true" />
                  {recipe.custo || "R$00,00"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
