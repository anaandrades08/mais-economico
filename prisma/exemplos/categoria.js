// prisma/exemplos/categoria.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.categoria.createMany({
    data: [
      { nome: 'Bolos e Tortas', link_categoria: '/categoria/bolosetortas' },
      { nome: 'Carnes', link_categoria: '/categoria/carnes' },
      { nome: 'Aves', link_categoria: '/categoria/aves' },
      { nome: 'Peixes e Frutos do Mar', link_categoria: '/categoria/peixesefrutosdomar' },
      { nome: 'Saladas e Molhos', link_categoria: '/categoria/saladasemolhos' },
      { nome: 'Massas', link_categoria: '/categoria/massas' },
      { nome: 'Vegetarianos e Veganos', link_categoria: '/categoria/vegetarianoseveganos' },
      { nome: 'Bebidas', link_categoria: '/categoria/bebidas' },
      { nome: 'Lanches', link_categoria: '/categoria/lanches' },
      { nome: 'Doces e Sobremesas', link_categoria: '/categoria/docesesobremesas' },
      { nome: 'Sopas', link_categoria: '/categoria/sopas' },
    ],
  });

  console.log('Categorias criadas!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
