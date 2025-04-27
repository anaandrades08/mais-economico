// prisma/exemplos/usuario.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.create({
    data: {
      nome: 'Ana Silva',
      email: 'ana@ana.com',
      senha: 'a1234567',
      endereco: 'Rua das Flores',
      numero:'123',
      cep: '79000-000',
      cidade: 'Campo Grande',
      estado: 'MS',
      img_usuario: '/images/usuario/fotodoperfil.png',
      ativo: 1,
      tipo: 1,
    },
  });

  console.log('Usuário criado!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
