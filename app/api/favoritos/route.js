// app/api/favoritos/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
export async function GET() {
    try {
      const todososfavoritos = await prisma.favorito.findMany();
  
      return NextResponse.json(todososfavoritos);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar favoritos' },
        { status: 500 }
      );
    }
}


// DELETE: Remove um favorito pelo id_favorito
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id_favorito } = body;

    if (!id_favorito) {
      return NextResponse.json(
        { error: 'id_favorito é obrigatório no corpo da requisição.' },
        { status: 400 }
      );
    }

    const favoritoDeletado = await prisma.favorito.delete({
      where: {
        id_favorito: parseInt(id_favorito),
      },
    });

    return NextResponse.json({
      message: `Favorito ${id_favorito} deletado com sucesso.`,
      favorito: favoritoDeletado,
    });
  } catch (error) {
    console.error('Erro ao deletar favorito:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar favorito' },
      { status: 500 }
    );
  }
}
