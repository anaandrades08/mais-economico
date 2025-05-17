//api/receitas/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
    try {
      const todasasReceitas = await prisma.receita.findMany({
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
  
      return NextResponse.json(todasasReceitas);
    } catch (error) {
      console.error('Erro ao buscar todas as receitas:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar todas as receitas' },
        { status: 500 }
      );
    }
  }


// PUT - Atualizar uma receita usando o ID do corpo da requisição
export async function PUT(request) {
  try {
    const dados = await request.json();
    const {
      id_receita,
      titulo_receita,
      descricao_receita,
      tempo_preparo,
      tempo_total,
      rendimento,
      custo,
      dificuldade,
      img_receita,
      id_categoria
    } = dados;

    if (!id_receita) {
      return NextResponse.json({ error: 'id_receita é obrigatório' }, { status: 400 });
    }

    const receitaAtualizada = await prisma.receita.update({
      where: { id_receita: Number(id_receita) },
      data: {
        titulo_receita,
        descricao_receita,
        tempo_preparo,
        tempo_total,
        rendimento,
        custo,
        dificuldade,
        img_receita,
        id_categoria
      }
    });

    return NextResponse.json({
      message: 'Receita atualizada com sucesso!',
      receita: receitaAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar a receita:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a receita' }, { status: 500 });
  }
}