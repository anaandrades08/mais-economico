//api/admin/receitas/route.js
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
          include: {
                usuario: true, // Inclui os dados do usuário
                categoria: true, // Inclui os dados da categoria
            },
        },
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
