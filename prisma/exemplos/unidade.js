// prisma/exemplos/unidade.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.unidadeMedida.createMany({
      data: [
        { unidade_medida: 'Quilograma', sigla: 'kg' },
        { unidade_medida: 'Grama', sigla: 'g' },
        { unidade_medida: 'MiliGrama', sigla: 'mg' },
        { unidade_medida: 'Litro', sigla: 'l' },
        { unidade_medida: 'Mililitro', sigla: 'ml' },
        { unidade_medida: 'Colher de sopa', sigla: 'cs' },
        { unidade_medida: 'Colher de chá', sigla: 'cc' },
        { unidade_medida: 'Xícara', sigla: 'xicara' },
        { unidade_medida: 'Copo', sigla: 'copo' },
        { unidade_medida: 'Pitada', sigla: 'pitada' },
        { unidade_medida: 'Unidade', sigla: 'un' },           // Ex: 1 ovo, 2 tomates
        { unidade_medida: 'Dente de alho', sigla: 'dente' },  // Muito comum
        { unidade_medida: 'Tablete', sigla: 'tablete' },      // Ex: manteiga
        { unidade_medida: 'Lata', sigla: 'lata' },            // Ex: leite condensado
        { unidade_medida: 'Pacote', sigla: 'pct' },           // Ex: pacote de macarrão
        { unidade_medida: 'Folha', sigla: 'folha' },          // Ex: louro, alface
        { unidade_medida: 'Ramo', sigla: 'ramo' },            // Ex: salsa, coentro
        { unidade_medida: 'Fatias', sigla: 'fatia' },         // Ex: pão, queijo
        { unidade_medida: 'Punhado', sigla: 'punhado' },      // Para ingredientes secos, tipo ervas
      ],
    });
  
  console.log('Unidades criadas!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

