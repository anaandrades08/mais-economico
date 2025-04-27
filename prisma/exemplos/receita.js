// prisma/exemplos/receita.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.receita.create({
    data: {
    id_categoria: 1,
    id_usuario: 1,
    titulo_receita: 'Bolo de Chocolate',
    descricao_receita: 'Uma deliciosa receita de bolo de chocolate fofinho e saboroso, ideal para festas ou ocasiões especiais.',
    tempo_preparo:    '40 minutos',
    tempo_total:     '1 hora',
    rendimento:       '10 pedaços',         
    custo:              50.50, 
    dificuldade:        'Média',  
    img_receita: '/images/receitas/bolosetortas/bolosetortas2.png', 
    ativo:          1,  
    },
  });

  console.log('Receita criada!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
