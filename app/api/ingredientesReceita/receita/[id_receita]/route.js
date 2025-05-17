// app/api/ingredientesReceita/receita/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma.ts';

export const GET = async (request, { params }) => {
  try {
    const { id_receita } = params;
    const recipeId = parseInt(id_receita);

    // Validação do ID
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID de receita inválido' },
        { status: 400 }
      );
    }

    // Busca os títulos de ingredientes com seus itens
    const titulosIngredientes = await prisma.tituloIngredientesReceita.findMany({
      where: { id_receita: recipeId },
      include: {
        ingredientes: {
          include: {
            ingrediente: {
              select: {
                id_ingrediente: true,
                id_tipo_ingrediente: true,
                descricao_ingrediente: true,
                valor: true
              }
            },
            unidadeMedida: {
              select: {
                sigla: true
              }
            }
          }
        }
      }
    });

    // Formata a resposta mesmo se for vazia
    const ingredientesReceita = (titulosIngredientes).map(titulo => ({
      id_titulo: titulo.id_titulo_ingrediente_receita,
      titulo: titulo.titulo_ingrediente_receita,
      itens: (titulo.ingredientes).map(ing => ({
        id_ingrediente_receita: ing.id_ingrediente_receita,
        id_ingrediente: ing.ingrediente.id_ingrediente,
        descricao_ingrediente: ing.ingrediente.descricao_ingrediente,
        quantidade: ing.quantidade,
        valor: ing.ingrediente.valor,
        sigla: ing.unidadeMedida.sigla,
        id_tipo_ingrediente: ing.ingrediente.id_tipo_ingrediente,
      }))
    }));

    return NextResponse.json(ingredientesReceita);
    
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
};

// POST - Cria um novo título de ingredientes vinculado a uma receita
export async function POST(request, { params }) {
  const { id_receita } = params;

  try {
    const data = await request.json();
    const { titulo_ingrediente_receita } = data;

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

    // Cria o título de ingredientes
    const novoTituloIngrediente = await prisma.tituloIngredientesReceita.create({
      data: {
        titulo_ingrediente_receita,
        id_receita: idReceitaInt
      }
    });

    return NextResponse.json(novoTituloIngrediente, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar título de ingredientes:', error);
    return NextResponse.json(
      { error: 'Erro ao criar título de ingredientes' },
      { status: 500 }
    );
  }
}
