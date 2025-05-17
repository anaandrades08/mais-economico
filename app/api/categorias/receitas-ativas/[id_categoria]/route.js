// app/api/categorias/receitas-ativas/[id_categoria]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET: exibe a categoria com suas receitas
export const GET = async (req, { params }) => {
  const { id_categoria } = params;

  try {
    const categoria = await prisma.categoria.findUnique({
      where: {
        id_categoria: parseInt(id_categoria),  // Certifique-se de que está sendo um número inteiro
      },
      include: {
        receitas: {
          where: {
            ativo: 1, // somente receitas ativas
          },
          orderBy: {
            data_cadastro: 'desc',  // Aqui foi corrigido o uso do orderBy
          },
          select: {
            id_receita: true,
            titulo_receita: true,
            tempo_preparo: true,
            tempo_total: true,
            rendimento: true,
            custo: true,
            dificuldade: true,
            img_receita: true,
            id_usuario: true,
            usuario: {
              select: {
                nome: true,
              },
            },
            categoria: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      categoria: {
        id_categoria: categoria.id_categoria,
        nome: categoria.nome,
        link_categoria: categoria.link_categoria,
      },
      receitas: categoria.receitas,
    });
  } catch (error) {
    console.error('Erro ao buscar receitas por categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar receitas da categoria.' },
      { status: 500 }
    );
  }
};
