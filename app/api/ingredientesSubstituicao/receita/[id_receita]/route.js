// app/api/ingredientesSubstituicao/[id_receita]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

/// Exibe substituições de ingredientes por id_receita
export async function GET(request, { params }) {
  const { id_receita } = params;

  try {
    const substituicoes = await prisma.substituicao.findMany({
      where: { id_receita: parseInt(id_receita) },
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
          select: {
            titulo: true
          }
        },
        ingrediente: {
          select: {
            descricao_ingrediente: true
          }
        },
        usuario: {
          select: {
            nome: true,
            email: true
          }
        },
        unidadeMedida: {
          select: {
            unidade_medida: true,
            sigla: true
          }
        }
      }
    });

    if (substituicoes.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma substituição de ingredientes encontrada para esta receita' },
        { status: 404 }
      );
    }

    return NextResponse.json(substituicoes);
  } catch (error) {
    console.error('Erro ao buscar substituições de ingredientes da receita:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar substituições de ingredientes  da receita' },
      { status: 500 }
    );
  }
}


export const POST = async (request, { params }) => {
  try {
    const { id_receita } = await params;
    const recipeId = parseInt(id_receita);
    //verificar se é receita valida
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID da receita inválido' },
        { status: 400 }
      );
    }
    // Lê o corpo da requisição, que deve conter os dados da substituição
    const data = await request.json();
    if (isNaN(data.id_usuario) || data.id_usuario <= 0) {
      return NextResponse.json(
        { error: 'ID da usuario inválido' },
        { status: 400 }
      );
    }
    // Valida se os dados necessários estão presentes
    if (!data.id_ingrediente || !data.id_uni_medida || !data.quantidade || !data.descricao_preparo) {
      return NextResponse.json(
        { error: 'Dados insuficientes para criar a substituição' },
        { status: 400 }
      );
    }

    
    // Verifica se a receita existe
    const receitaExists = await prisma.receita.findUnique({
      where: { id_receita: recipeId },
      select: { id_receita: true }
    });

    if (!receitaExists) {
      return NextResponse.json(
        { error: 'Receita não encontrada' },
        { status: 404 }
      );
    }

      // Verifica se o ingrediente existe
    const ingredienteExists = await prisma.ingrediente.findUnique({
      where: { id_ingrediente: data.id_ingrediente },
      select: { id_ingrediente: true }
    });

    if (!ingredienteExists) {
      return NextResponse.json(
        { error: 'Ingrediente não encontrado' },
        { status: 404 }
      );
    }

      // Verifica se o ingrediente existe
    const usuarioExists = await prisma.usuario.findUnique({
      where: { id: data.id_usuario },
      select: { id: true }
    });

    if (!usuarioExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Cria uma nova substituição de ingrediente para a receita especificada
    const substituicaoCriada = await prisma.substituicao.create({
      data: {
        id_receita: recipeId,
        id_ingrediente: data.id_ingrediente,
        id_usuario: data.id_usuario,
        descricao_preparo: data.descricao_preparo,
        quantidade: data.quantidade,
        id_uni_medida: data.id_uni_medida,
        ativo: data.ativo || null,
      },
    });

    // Retorna a substituição criada
    return NextResponse.json(substituicaoCriada, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar substituição de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar substituição de ingrediente' },
      { status: 500 }
    );
  }
}