// app/api/ingredientesSubstituicao/[id_substituicao]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

////// Exibe substituição pelo id_substituicao
export async function GET(request, { params }) {
  const { id_substituicao } = params;

  try {
    const substituicao = await prisma.substituicao.findUnique({
      where: { id_substituicao: parseInt(id_substituicao) },
      select: {
        id_substituicao: true,
        id_receita: true,
        id_ingrediente: true,
        id_usuario: true,
        descricao_preparo: true,
        quantidade: true,
        id_uni_medida: true,
        ativo: true,
        data_cadastro: true,
        receita: {
          select: { titulo: true }
        },
        ingrediente: {
          select: { descricao_ingrediente: true }
        },
        usuario: {
          select: { nome: true, email: true }
        },
        unidadeMedida: {
          select: { unidade_medida: true, sigla: true }
        }
      }
    });

    if (!substituicao) {
      return NextResponse.json(
        { error: 'Substituição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(substituicao);
  } catch (error) {
    console.error('Erro ao buscar substituição:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar substituição' },
      { status: 500 }
    );
  }
}

/////// Altera substituição pelo id_substituicao
export async function PUT(request, { params }) {
  const { id_substituicao } = params;

  try {
    const data = await request.json();

    const substituicaoAtualizada = await prisma.substituicao.update({
      where: { id_substituicao: parseInt(id_substituicao) },
      data: {
        id_receita: data.id_receita,
        id_ingrediente: data.id_ingrediente,
        id_usuario: data.id_usuario,
        descricao_preparo: data.descricao_preparo,
        quantidade: data.quantidade,
        id_uni_medida: data.id_uni_medida,
        ativo: data.ativo
      }
    });

    return NextResponse.json(substituicaoAtualizada);
  } catch (error) {
    console.error('Erro ao alterar substituição:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar substituição' },
      { status: 500 }
    );
  }
}

/////// Exclui substituição pelo id_substituicao
export async function DELETE(request, { params }) {
  const { id_substituicao } = params;

  try {
    const substituicaoExistente = await prisma.substituicao.findUnique({
      where: { id_substituicao: parseInt(id_substituicao) }
    });

    if (!substituicaoExistente) {
      return NextResponse.json(
        { error: 'Substituição não encontrada' },
        { status: 404 }
      );
    }

    await prisma.substituicao.delete({
      where: { id_substituicao: parseInt(id_substituicao) }
    });

    return NextResponse.json({ message: 'Substituição excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir substituição:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir substituição' },
      { status: 500 }
    );
  }
}
