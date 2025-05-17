// app/api/receitas/[id_categoria]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Função para obter o receitas pelo ID da categoria
export const GET = async (req) => {
  const { id_categoria } = req.params; 
  try {

    const receitas = await prisma.receita.findUnique({
      where: {
        id_categoria: parseInt(id_categoria), 
      },
      orderBy: {
        data_cadastro: 'desc', // ordenar por data mais recente
      },
      select: {
        id_receita: true,
        titulo_receita: true,
        descricao_receita: true,
        tempo_preparo: true,
        tempo_total: true,
        rendimento: true,
        custo: true,
        dificuldade: true,
        img_receita: true,
        data_cadastro: true,
        id_categoria: true,
        id_usuario: true,
        usuario: {
          select: {
            nome: true // pega o nome do usuário
          }
        },
        categoria: {
          select: {
            nome: true // pega o nome da categoria
          }
        }
      }
    });

    if (!receitas) {
      return NextResponse.json({ error: 'Receitas da categoria não encontradas' }, { status: 404 });
    }

    return NextResponse.json(receitas);
  } catch (error) {
    console.error('Erro ao buscar receitas da categoria:', error);
    return NextResponse.json({ error: 'Erro ao buscar receitas da categoria' }, { status: 500 });
  }
}