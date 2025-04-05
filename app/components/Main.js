import styles from "../styles/Main.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  moreRecipes,
  Recipes,
  recipesByCategory,
} from "../data/RecipesData.js";

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
                    alt={recipe.name}
                    width={293}
                    height={240}
                    className={styles.recipeImg}
                    priority={recipe.id < 4}
                  />
                </a>
              </Link>
              <h2 className={styles.recipeTitle}>{recipe.name}</h2>
              <div className={styles.recipeDetails}>
                <span>
                  <Image
                    src="/images/layout/icons/icons_user.png"
                    alt="Nome usuário"
                    width={24}
                    height={24}
                    className={styles.userIcon}
                    priority
                  />
                  {recipe.usuario || "Nome do usuário"}
                </span>
                <span>
                  <Image
                    src="/images/layout/icons/hugeicons_date-time.png"
                    alt="date-time"
                    width={24}
                    height={24}
                    className={styles.dateTimeIcon}
                    priority
                  />{" "}
                  {recipe.tempo || "00:00h"}
                </span>
                <span>
                  <Image
                    src="/images/layout/icons/time-line.png"
                    alt="time-line"
                    width={24}
                    height={24}
                    className={styles.TimeLineIcon}
                    priority
                  />
                  {recipe.preparo || "00:00h"}
                </span>
                <span>
                  <Image
                    src="/images/layout/icons/tabler_coin.png"
                    alt="tabler_coin"
                    width={24}
                    height={24}
                    className={styles.CoinIcon}
                    priority
                  />
                  {recipe.custo || "R$00,00"}
                </span>
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
                    alt={recipe.name}
                    width={293}
                    height={240}
                    className={styles.recipeImg}
                    priority={recipe.id < 4}
                  />
                </a>
              </Link>
              <h2 className={styles.recipeTitle}>{recipe.name}</h2>
              <div className={styles.recipeDetails}>
                <span>
                  <Image
                    src="/images/layout/icons/icons_user.png"
                    alt="Nome usuário"
                    width={24}
                    height={24}
                    className={styles.userIcon}
                    priority
                  />
                  {recipe.usuario || "Nome do usuário"}
                </span>
                <span>
                  <Image
                    src="/images/layout/icons/hugeicons_date-time.png"
                    alt="date-time"
                    width={24}
                    height={24}
                    className={styles.dateTimeIcon}
                    priority
                  />{" "}
                  {recipe.tempo || "00:00h"}
                </span>
                <span>
                  <Image
                    src="/images/layout/icons/time-line.png"
                    alt="time-line"
                    width={24}
                    height={24}
                    className={styles.TimeLineIcon}
                    priority
                  />
                  {recipe.preparo || "00:00h"}
                </span>
                <span>
                  <Image
                    src="/images/layout/icons/tabler_coin.png"
                    alt="tabler_coin"
                    width={24}
                    height={24}
                    className={styles.CoinIcon}
                    priority
                  />
                  {recipe.custo || "R$00,00"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Mais Receitas */}
      <section className={styles.recipesMoreSection}>
        <h1 className={styles.categoryTitle}>Mais Receitas</h1>
        <div className={styles.recipesList}>
          {moreRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeItem}>
              <Link href={`/pages/receita/${recipe.id}`} passHref legacyBehavior>
                <a>
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    width={200}
                    height={150}
                    className={styles.recipeMoreImg}
                    priority={recipe.id < 4}
                  />
                </a>
              </Link>
              <p className={styles.recipeMoreTitle}>{recipe.name}</p>
              <div className={styles.recipeMoreDetails}>
                <p className={styles.recipeMoreIncos}>
                  {" "}
                  <Image
                    src="/images/layout/icons/time-line.png"
                    alt="time-line"
                    width={24}
                    height={24}
                    className={styles.TimeLineIcon}
                    priority
                  />
                  {recipe.preparo || "00:00h"}
                </p>
                <p>
                  {" "}
                  <Image
                    src="/images/layout/icons/tabler_coin.png"
                    alt="tabler_coin"
                    width={24}
                    height={24}
                    className={styles.CoinIcon}
                    priority
                  />
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
