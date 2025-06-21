// app/api/dicas/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export const GET = async (req, { params }) => {
  const { id } = params;
  
  try {
    const dica = await prisma.dica.findUnique({
      where: { id_dica: parseInt(id) },
      include: {
        categoria: {
          select: {
            nome: true
          }
        },
        usuario: {
          select: {
            nome: true
          }
        }
      }
    });

    if (!dica) {
      return NextResponse.json(
        { success: false, error: 'Dica não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dica
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar dica' },
      { status: 500 }
    );
  }
};