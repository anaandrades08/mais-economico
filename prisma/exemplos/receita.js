// prisma/exemplos/receita.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.receita.createMany({
    data: [
      {
        id_categoria: 1,
        id_usuario: 1,
        titulo_receita: 'Bolo de Creme',
        descricao_receita: 'Bolo de chocolate fofinho com recheio cremoso de leite ninho. Massa leve e úmida, combinando o sabor intenso do cacau com a doçura suave do leite em pó. Camadas equilibradas que derretem na boca e trazem conforto a cada fatia. Ideal para festas, cafés ou um mimo no fim do dia. Uma explosão de sabor que une tradição e indulgência na medida certa.',
        tempo_preparo: '50 minutos',
        tempo_total: '1 hora',
        rendimento: '10 pedaços',
        custo: 60.00,
        dificuldade: 'Média',
        img_receita: '/images/receitas/bolosetortas/bolosetortas1.png',
        ativo: 1,
      },
      {
        id_categoria: 2,
        id_usuario: 1,
        titulo_receita: 'Bolo de Baunilha',
        descricao_receita: 'Bolo de chocolate fofinho com recheio cremoso de leite ninho. Massa leve e úmida, combinando o sabor intenso do cacau com a doçura suave do leite em pó. Camadas equilibradas que derretem na boca e trazem conforto a cada fatia. Ideal para festas, cafés ou um mimo no fim do dia. Uma explosão de sabor que une tradição e indulgência na medida certa.',
        tempo_preparo: '30 minutos',
        tempo_total: '1 hora',
        rendimento: '8 fatias',
        custo: 40.00,
        dificuldade: 'Fácil',
        img_receita: '/images/receitas/bolosetortas/bolosetortas3.png',
        ativo: 1,
      },
      {
        id_categoria: 3,
        id_usuario: 1,
        titulo_receita: 'Macarrão ao Alho e Óleo',
        descricao_receita: 'Macarrão al dente envolvido em um molho cremoso e saboroso. Massa leve e bem cozida, combinando o toque clássico do trigo com o tempero caseiro marcante. Camadas de sabor que abraçam o paladar e trazem conforto a cada garfada. Ideal para almoços especiais, jantares em família ou momentos de puro prazer. Uma explosão de sabor que une tradição e simplicidade na medida certa.',
        tempo_preparo: '15 minutos',
        tempo_total: '20 minutos',
        rendimento: '2 porções',
        custo: 20.00,
        dificuldade: 'Fácil',
        img_receita: '/images/receitas/massas/massas1.png',
        ativo: 1,
      },
      {
        id_categoria: 3,
        id_usuario: 1,
        titulo_receita: 'Macarronada da Mama',
        descricao_receita: 'Macarrão al dente envolvido em um molho cremoso e saboroso. Massa leve e bem cozida, combinando o toque clássico do trigo com o tempero caseiro marcante. Camadas de sabor que abraçam o paladar e trazem conforto a cada garfada. Ideal para almoços especiais, jantares em família ou momentos de puro prazer. Uma explosão de sabor que une tradição e simplicidade na medida certa.',
        tempo_preparo: '20 minutos',
        tempo_total: '60 minutos',
        rendimento: '2 porções',
        custo: 25.00,
        dificuldade: 'Fácil',
        img_receita: '/images/receitas/massas/massas2.png',
        ativo: 1,
      },
      {
        id_categoria: 3,
        id_usuario: 1,
        titulo_receita: 'Pasta Italiana',
        descricao_receita: 'Macarrão al dente envolvido em um molho cremoso e saboroso. Massa leve e bem cozida, combinando o toque clássico do trigo com o tempero caseiro marcante. Camadas de sabor que abraçam o paladar e trazem conforto a cada garfada. Ideal para almoços especiais, jantares em família ou momentos de puro prazer. Uma explosão de sabor que une tradição e simplicidade na medida certa.',
        tempo_preparo: '30 minutos',
        tempo_total: '60 minutos',
        rendimento: '2 porções',
        custo: 30.00,
        dificuldade: 'Médio',
        img_receita: '/images/receitas/massas/massas3.png',
        ativo: 1,
      },
      {
        id_categoria: 7,
        id_usuario: 1,
        titulo_receita: 'Hambúrguer de Grão-de-Bico',
        descricao_receita: 'Hambúrguer vegano nutritivo feito com grão-de-bico, perfeito para um lanche saudável e rico em proteínas vegetais. Textura firme por fora e macia por dentro, com tempero equilibrado que realça o sabor natural do grão-de-bico. Pode ser servido em pão integral ou acompanhado de saladas.',
        tempo_preparo: '40 minutos',
        tempo_total: '1 hora',
        rendimento: '3 porções',
        custo: 35.00,
        dificuldade: 'Médio',
        img_receita: '/images/receitas/vegetarianoseveganos/hamburgueres-veganos.jpg',
        ativo: 1,
      },
    ],
  });

  console.log('Receitas criadas!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
