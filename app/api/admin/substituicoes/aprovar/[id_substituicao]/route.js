// app/api/admin/substituicoes/aprovar/[id_substituicao]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id_substituicao } = params;

    // Validação do ID
    if (!id_substituicao || isNaN(parseInt(id_substituicao))) {
      return NextResponse.json(
        { success: false, error: 'ID do substituicao inválido' },
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

    // Verifica se o substituicao existe
    const substituicao = await prisma.substituicao.findUnique({
      where: { id_substituicao: parseInt(id_substituicao) }
    });

    if (!substituicao) {
      return NextResponse.json(
        { success: false, error: 'Substituicao não encontrado' },
        { status: 404 }
      );
    }

    // Atualiza o substituicao com o status recebido
    const updatedSubstituicao = await prisma.substituicao.update({
      where: { id_substituicao: parseInt(id_substituicao) },
      data: { ativo }
    });

    return NextResponse.json({
      success: true,
      data: updatedSubstituicao
    });

  } catch (error) {
    console.error('Erro ao atualizar substituicao:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}