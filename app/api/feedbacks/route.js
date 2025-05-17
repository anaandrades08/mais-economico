// app/api/feedbacks/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@app/lib/prisma'
export async function GET() {
    try {
        const feedbacks = await prisma.feedback.findUnique({
            orderBy: {
              data_cadastro: 'desc' //ordenar por data de cadastro descrescente
            },
            select: {
              id_feedback: true,
              id_receita: true,
              id_usuario: true,
              feedback: true,
              total_estrela: true,
              data_cadastro: true,
              usuario: {
                select: {
                  nome: true
                },
              },
            },
          });
  
      return NextResponse.json(feedbacks);
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar feedbacks' },
        { status: 500 }
      );
    }
  }

// Método POST: cria novo feedback
export async function POST(request) {
  try {
    const body = await request.json();

    const { id_receita, id_usuario, feedback, total_estrela } = body;
    const recipeId  = parseInt(id_receita);
    const userId    =  parseInt(id_usuario);

    if (!id_receita || !id_usuario || !feedback || total_estrela == null) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID receita inválido' },
        { status: 400 }
      );
    }
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'ID usuário inválido' },
        { status: 400 }
      );
    }

    const novoFeedback = await prisma.feedback.create({
      data: {
        id_receita: recipeId,
        id_usuario: userId,
        feedback: feedback,
        total_estrela: total_estrela,
        data_cadastro: new Date(),
      }
    });

    return NextResponse.json(novoFeedback, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar feedback:', error);
    return NextResponse.json(
      { error: 'Erro ao criar feedback' },
      { status: 500 }
    );
  }
}
