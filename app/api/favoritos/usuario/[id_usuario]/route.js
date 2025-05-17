// app/api/favoritos/usuario/[id_usuario]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma'; 

// Busca os favoritos de um usuário específico pelo id_usuario
export const GET = async (req, { params }) => {
  const { id_usuario } = params;

  try {
    const favoritos = await prisma.favorito.findMany({
      where: {
        id_usuario: parseInt(id_usuario),  // id de usuario
      },      
      orderBy: {
        data_cadastro: 'desc',  // order por data de cadastro de favorito
      },
      include: {
        receita: {
          select: {
            titulo_receita: true,
            img_receita: true,
            ativo: true,
          },
        },
      },
    });

    if (favoritos.length === 0) {
      return NextResponse.json(
        { error: 'Favoritos não encontrados para o usuário.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favoritos: favoritos.map(fav => ({
        id_favorito:    fav.id_favorito,
        id_receita:     fav.id_receita,
        titulo_receita: fav.receita.titulo_receita,
        img_receita:    fav.receita.img_receita,
        ativo:          fav.receita.ativo,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar favoritos para o usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar favoritos para o usuário.' },
      { status: 500 }
    );
  }
};



// DELETE: Remove todos os favoritos do usuário
export async function DELETE(request, { params }) {
  const { id_usuario } = params;

  try {
    const deleteResult = await prisma.favorito.deleteMany({
      where: {
        id_usuario: parseInt(id_usuario),
      },
    });

    return NextResponse.json({
      message: `Favoritos do usuário ${id_usuario} deletados com sucesso.`,
      count: deleteResult.count,
    });
  } catch (error) {
    console.error('Erro ao deletar favoritos do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar favoritos' },
      { status: 500 }
    );
  }
}