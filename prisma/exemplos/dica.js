
// prisma/exemplos/dica.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.dica.createMany({
    data: [
    {  id_categoria: 3, titulo: 'Que tal um frango assado para o almoço de domingo? ', descricao: 'Receitas práticas para quem tem pouco tempo, mas quer comer bem.', cta_text: 'Ver Receitas de Aves', img_dica: '/images/banner/banner-dica-4.png', id_usuario: 1, ativo:1 },
    {  id_categoria: 4, titulo: 'Receitas de Peixes e Frutos do Mar', descricao: 'Aprenda a fazer os melhores pratos com peixes e frutos do mar', cta_text: 'Ver Receitas de Peixes e frutos do mar', img_dica: '/images/banner/banner-dica-5.png', id_usuario: 1, ativo:1  },
    {  id_categoria: 8, titulo: 'Receitas Especiais para o Verão', descricao: 'Descubra as melhores receitas refrescantes para os dias quentes', cta_text: 'Ver Receitas de Bebidas', img_dica: '/images/banner/banner-dica-6.png', id_usuario: 1, ativo:1  },
    {  id_categoria: 9, titulo: 'Lanches para comer no Café da Manhã', descricao: 'Receitas práticas para quem tem pouco tempo', cta_text: 'Ver Receitas de Lanches', img_dica: '/images/banner/banner-dica-2.png', id_usuario: 1, ativo:1  },
    {  id_categoria: 10, titulo: 'Doces Incríveis para o Outono', descricao: 'Aprenda a fazer os melhores doces para curtir a estação', cta_text: 'Ver Receitas de Doces e sobremesas', img_dica: '/images/banner/banner-dica-3.png', id_usuario: 1, ativo:1  },    
    {  id_categoria: 5, titulo: 'Massa Folhada Caseira', descricao: 'Aprenda a fazer a massa folhada perfeita para suas receitas', cta_text: 'Ver Receitas de Massas', img_dica: '/images/banner/banner-dica-1.png', id_usuario: 1, ativo:1  },    
],
  });

  console.log('Dicas criadas!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


  