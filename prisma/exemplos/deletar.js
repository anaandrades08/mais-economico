// prisma/exemplos/deletar.js
/*import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deletarCategoriaPorId(id) {
  try {
    const categoriaDeletada = await prisma.categoria.delete({
      where: {
        id_categoria: id,    
        },
    });

    console.log('Categoria deletada:', categoriaDeletada);
  } catch (error) {
    console.error('Erro ao deletar categoria:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// //Exemplo: deletar categoria com ID 3
deletarCategoriaPorId(id);*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.ingrediente.deleteMany({});
    console.log("Todos os registros foram removidos!");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });