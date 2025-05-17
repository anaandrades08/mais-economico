// app/api/feebacks/usuario/[id_usuario]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Função para obter o feedbacks pelo ID do usuário
export const GET = async (req, { params }) => {
  const { id_usuario } = params;
  
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
      },
      orderBy: {
        data_cadastro: 'desc'
      },
      include: {
        usuario: {
          select: {
            nome: true
          }
        },
        receita: {
          select: {
            titulo_receita: true,
            img_receita: true
          }
        }
      }
    });

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum feedback encontrado para este usuário' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar feedbacks' },
      { status: 500 }
    );
  }
}

// PUT: Alterar um feedback específico do usuário
export async function PUT(request, { params }) {
    const { id_usuario } = params;
    const { id_feedback, feedback, total_estrela, ativo } = await request.json();
  
    try {
      const feedbackAtualizado = await prisma.feedback.updateMany({
        where: {
          id_usuario: parseInt(id_usuario),
          id_feedback: parseInt(id_feedback),
        },
        data: {
          feedback,
          total_estrela,
          ativo: null,
        },
      });
  
      return NextResponse.json({ message: 'Feedback atualizado com sucesso', feedbackAtualizado });
    } catch (error) {
      console.error('Erro ao atualizar feedback:', error);
      return NextResponse.json({ error: 'Erro ao atualizar feedback' }, { status: 500 });
    }
  }
  
  // DELETE: Excluir um feedback específico do usuário
  export async function DELETE(request, { params }) {
    const { id_usuario } = params;
    const { id_feedback } = await request.json();
  
    try {
      const feedbackRemovido = await prisma.feedback.deleteMany({
        where: {
          id_usuario: parseInt(id_usuario),
          id_feedback: parseInt(id_feedback),
        },
      });
  
      return NextResponse.json({ message: 'Feedback excluído com sucesso', feedbackRemovido });
    } catch (error) {
      console.error('Erro ao excluir feedback:', error);
      return NextResponse.json({ error: 'Erro ao excluir feedback' }, { status: 500 });
    }
  }