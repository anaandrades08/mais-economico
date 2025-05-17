// app/api/modoPreparo/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET - Lista todos os títulos de preparo com seus modos
export async function GET() {
  try {

const titulosComModos = await prisma.tituloPreparo.findMany({
    include: {
      modosPreparo: {
        select: {
          id_preparo: true,
          descricao_preparo: true,
          data_cadastro: true,
        }
      },
      receita: {
        select: {
          id_receita: true,
          titulo_receita: true, // se houver esse campo
        }
      }
    }
  });

    return NextResponse.json(modosPreparo);
  } catch (error) {
    console.error('Erro ao buscar modos de preparo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar modos de preparo' },
      { status: 500 }
    );
  }
}

