// app/api/favoritos/[id_favorito/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 

// DELETE: Remove o favorito
export async function DELETE(request, { params }) {
    const { id_favorito } = params;
  
    try {
      const deleteFavorito = await prisma.favorito.delete({
        where: {
          id_favorito: parseInt(id_favorito),
        },
      });
  
      return NextResponse.json({
        message: `Favorito com id ${deleteFavorito.id_favorito} deletado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao deletar favorito:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar favorito' },
        { status: 500 }
      );
    }
  }