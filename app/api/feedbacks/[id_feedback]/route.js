// app/api/feebacks/[id_feedback]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Função para obter o feedbacks pelo ID da receita
export const GET = async (req) => {
  const { id_feedback } = req.params; 
  try {

    const feedbacks = await prisma.feedback.findUnique({
      where: {
        id_feedback: parseInt(id_feedback),
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

    if (!feedbacks) {
      return NextResponse.json({ error: 'Feedback não encontrado' }, { status: 404 });
    }

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar feedback:', error);
    return NextResponse.json({ error: 'Erro ao buscar feedback' }, { status: 500 });
  }
}


// PUT: Alterar status
export async function PUT(request, { params }) {
    const { id_feedback } = params;
    const { feedback, total_estrela } = await request.json();
  
    try {
      const feedbackAtualizado = await prisma.feedback.update({
        where: {
          id_feedback: parseInt(id_feedback),
        },
        data: {
          ativo,
        },
      });
  
      return NextResponse.json({ message: 'Feedback atualizado com sucesso', feedbackAtualizado });
    } catch (error) {
      console.error('Erro ao atualizar feedback:', error);
      return NextResponse.json({ error: 'Erro ao atualizar feedback' }, { status: 500 });
    }
  }
  
  // DELETE: Excluir um feedback específico pelo id_feedback
  export async function DELETE(request, { params }) {
    const { id_feedback } = params;
  
    try {
      await prisma.feedback.delete({
        where: {
          id_feedback: parseInt(id_feedback),
        },
      });
  
      return NextResponse.json({ message: 'Feedback excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir feedback:', error);
      return NextResponse.json({ error: 'Erro ao excluir feedback' }, { status: 500 });
    }
  }
  