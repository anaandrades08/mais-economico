// prisma/exemplos/tipo_ingrediente.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
async function main() {
    await prisma.tipoIngrediente.createMany({
      data: [
        { tipo_ingrediente: 'Carnes' },
        { tipo_ingrediente: 'Aves' },
        { tipo_ingrediente: 'Peixes e Frutos do Mar' },
        { tipo_ingrediente: 'Laticínios' },
        { tipo_ingrediente: 'Legumes' },
        { tipo_ingrediente: 'Verduras' },
        { tipo_ingrediente: 'Frutas' },
        { tipo_ingrediente: 'Grãos e Cereais' },
        { tipo_ingrediente: 'Temperos e Especiarias' },
        { tipo_ingrediente: 'Massas e Farinhas' },
        { tipo_ingrediente: 'Óleos e Gorduras' },
        { tipo_ingrediente: 'Doces e Açúcares' },
        { tipo_ingrediente: 'Bebidas' },
        { tipo_ingrediente: 'Outros' },
      ],
    });
  
    console.log('Tipos de ingredientes criados!');
  }
  
main()
.catch(e => {
  console.error(e);
  process.exit(1);
})
.finally(() => prisma.$disconnect());
