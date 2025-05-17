// app/api/modoPreparo/receita/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - Lista os títulos de preparo e modos de preparo, filtrando por id_receita
export async function GET(request, { params }) {
  const { id_receita } = params; 
  if (!id_receita) {
    return NextResponse.json({ error: 'ID da receita não encontrado' }, { status: 400 });
  }

  try {
    const mododepreparo = await prisma.tituloPreparo.findMany({
      where: {
        id_receita: parseInt(id_receita), 
      },
      include: {
          receita: {
            select: {
              id_receita: true,
              titulo_receita: true
            }
          },
          modosPreparo: {
            select: {
              id_preparo: true,
              descricao_preparo: true,
            }
        }
      },
    });

    // Retorna um array vazio se não encontrar dados, sem erro de status 404
    return NextResponse.json(mododepreparo, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar modo de preparo por id_receita:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar modo de preparo' },
      { status: 500 }
    );
  }
}

// POST - Cria um novo título de preparo vinculado a uma receita
export async function POST(request, { params }) {
  const { id_receita } = params;

  try {
    const data = await request.json();
    const { titulo_preparo } = data;

    const idReceitaInt = parseInt(id_receita);
    if (isNaN(idReceitaInt)) {
      return NextResponse.json(
        { error: 'ID da receita inválido.' },
        { status: 400 }
      );
    }

    // Verifica se a receita existe
    const receita = await prisma.receita.findUnique({
      where: { id_receita: idReceitaInt }
    });

    if (!receita) {
      return NextResponse.json(
        { error: 'Receita não encontrada.' },
        { status: 404 }
      );
    }

    // Cria o título de preparo
    const novoTituloPreparo = await prisma.tituloPreparo.create({
      data: {
        titulo_preparo: titulo_preparo,
        id_receita: idReceitaInt
      }
    });

    return NextResponse.json(novoTituloPreparo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar título de preparo:', error);
    return NextResponse.json(
      { error: 'Erro ao criar título de preparo' },
      { status: 500 }
    );
  }
}
