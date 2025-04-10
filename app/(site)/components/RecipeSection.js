const RecipeSection = ({ title, recipes }) => (
    <section className={styles.recipesSection}>
      <h1 className={styles.categoryTitle}>{title}</h1>
      <div className={styles.recipeGrid}>
        {recipes.slice(0, 3).map((recipe) => (
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
                <PiUserCircleFill size={24} className={styles.userIcon} />
                {recipe.usuario || "Nome do usuário"}
              </span>
              <span>
                <TbCalendarTime size={24} className={styles.dateTimeIcon} />
                {recipe.tempo || "00:00h"}
              </span>
              <span>
                <FaRegClock size={20} className={styles.TimeLineIcon} />
                {recipe.preparo || "00:00h"}
              </span>
              <span>
                <TbCoin size={24} className={styles.CoinIcon} />
                {recipe.custo || "R$00,00"}
              </span>
              <span>
                <FiBookmark size={20} className={styles.Icon} />
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
  );