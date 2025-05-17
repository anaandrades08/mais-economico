// app/api/ingredientesSubstituicao/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// GET - Exibir todas as substituições de ingredientes
export async function GET() {
  try {
    const substituicoes = await prisma.substituicao.findMany({
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

    return NextResponse.json(substituicoes);
  } catch (error) {
    console.error('Erro ao buscar substituições de ingredientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar substituições de ingredientes' },
      { status: 500 }
    );
  }
}

// POST - Cadastrar nova substituição de ingrediente
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      id_receita,
      id_ingrediente,
      id_usuario,
      descricao_preparo,
      quantidade,
      id_uni_medida,
    } = data;

    // Validação simples
    if (!id_receita || !id_ingrediente || !id_usuario || !quantidade || !id_uni_medida) {
      return NextResponse.json(
        { error: 'Campos obrigatórios estão faltando.' },
        { status: 400 }
      );
    }

    const novaSubstituicao = await prisma.substituicao.create({
      data: {
        id_receita,
        id_ingrediente,
        id_usuario,
        descricao_preparo,
        quantidade,
        id_uni_medida,
        ativo: null,
        data_cadastro: new Date()
      }
    });

    return NextResponse.json(novaSubstituicao, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar substituição de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar substituição de ingrediente' },
      { status: 500 }
    );
  }
}
