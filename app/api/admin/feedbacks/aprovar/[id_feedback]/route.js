// app/api/admin/feedbacks/aprovar/[id_feedback]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id_feedback } = params;

    // Validação do ID
    if (!id_feedback || isNaN(parseInt(id_feedback))) {
      return NextResponse.json(
        { success: false, error: 'ID do feedback inválido' },
        { status: 400 }
      );
    }

    // Obter dados do corpo da requisição (JSON)
    const requestData = await request.json();
    const { ativo } = requestData;

    // Validação do status
    if (ativo === undefined || ![0, 1, 2].includes(ativo)) {
      return NextResponse.json(
        { success: false, error: 'Status inválido. Use 0 (inativo), 1 (aprovado) ou 2 (reprovado)' },
        { status: 400 }
      );
    }

    // Verifica se o feedback existe
    const feedback = await prisma.feedback.findUnique({
      where: { id_feedback: parseInt(id_feedback) }
    });

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: 'Feedback não encontrado' },
        { status: 404 }
      );
    }

    // Atualiza o feedback com o status recebido
    const updatedFeedback = await prisma.feedback.update({
      where: { id_feedback: parseInt(id_feedback) },
      data: { ativo }
    });

    return NextResponse.json({
      success: true,
      data: updatedFeedback
    });

  } catch (error) {
    console.error('Erro ao atualizar feedback:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}