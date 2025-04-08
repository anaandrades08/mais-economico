export const moreRecipes = [
  {
    id: 1,
    name: "Ovo Mexido",
    image: "/images/receitas/maisreceitas/maisreceitas1.png",
    slug: "bolo-de-creme",
    category: "vegetarianas"
  },
  {
    id: 2,
    name: "Pizza de Peperoni",
    image: "/images/receitas/maisreceitas/maisreceitas2.png",
    slug: "bolo-de-chocolate",
    category: "massas"
  },
  {
    id: 3,
    name: "Bolo na Taça",
    image: "/images/receitas/maisreceitas/maisreceitas3.png",
    slug: "pao-de-queijo",
    category: "bolosetortas"
  },
  {
    id: 4,
    name: "Drink de abacaxi",
    image: "/images/receitas/maisreceitas/maisreceitas4.png",
    slug: "pao-de-queijo",
    category: "bebidas"
  },
  {
    id: 5,
    name: "Panetone",
    image: "/images/receitas/maisreceitas/maisreceitas5.png",
    slug: "pao-de-queijo",
    category: "massas"
  },
  {
    id: 6,
    name: "Fetuttini",
    image: "/images/receitas/maisreceitas/maisreceitas6.png",
    slug: "pao-de-queijo",
    category: "massas"
  },
  {
    id: 7,
    name: "Almondegas",
    image: "/images/receitas/maisreceitas/maisreceitas7.png",
    slug: "pao-de-queijo",
    category: "carnes"
  },
  {
    id: 8,
    name: "Sopa de Abóbora",
    image: "/images/receitas/maisreceitas/maisreceitas8.png",
    slug: "pao-de-queijo",
    category: "sopas"
  },
];
  
  // Opcional: exportar por categorias
  export const recipesByCategory = {
    bolos: moreRecipes.filter(recipe => recipe.category === "bolos"),
    massas: moreRecipes.filter(recipe => recipe.category === "massas"),
    // ... outras categorias
  };