// app/api/usuarios/excluir-conta/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Função para excluir o usuário
export const DELETE = async (request) => {
  try {
    const data = await request.json(); // Pega o body da requisição
    const { id } = data; // Pega o ID do usuário

    
    // Deletar dicas associadas ao usuário
    await prisma.dica.deleteMany({
        where: { id_usuario: parseInt(id) }
      });
  
      // Deletar substituicao associados ao usuário
      await prisma.substituicao.deleteMany({
        where: { id_usuario: parseInt(id) }
      });
  
      // Deletar favoritos associados ao usuário
      await prisma.favorito.deleteMany({
        where: { id_usuario: parseInt(id) }
      });
  
      // Deletar os modos de preparo das receitas do usuário
      await prisma.modoPreparo.deleteMany({
        where: {
          id_titulo_preparo: {
            in: await prisma.tituloPreparo.findMany({
              where: { receita: { id_usuario: parseInt(id) } },
              select: { id_titulo_preparo: true }
            }).then(titulos => titulos.map(t => t.id_titulo_preparo))
          }
        }
      });
  
      // Deletar os títulos de preparo das receitas do usuário
      await prisma.tituloPreparo.deleteMany({
        where: { receita: { id_usuario: parseInt(id) } }
      });
  
      // Deletar os ingredientes das receitas do usuário
      await prisma.ingredienteReceita.deleteMany({
        where: {
          id_titulo_ingrediente_receita: {
            in: await prisma.tituloIngredientesReceita.findMany({
              where: { receita: { id_usuario: parseInt(id) } },
              select: { id_titulo_ingrediente_receita: true }
            }).then(titulos => titulos.map(t => t.id_titulo_ingrediente_receita))
          }
        }
      });
  
      // Deletar os títulos de ingredientes das receitas do usuário
      await prisma.tituloIngredientesReceita.deleteMany({
        where: { receita: { id_usuario: parseInt(id) } }
      });
  
      // Deletar a receita associada ao usuário
      await prisma.receita.deleteMany({
        where: { id_usuario: parseInt(id) },
      });
  
      // Agora, deletar o usuário
      await prisma.usuario.delete({
        where: { id: parseInt(id) }
      });

    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o usuário:', error);
    return NextResponse.json({ error: 'Erro ao excluir o usuário' }, { status: 500 });
  }
};
