//api/receitas/receitas-inativas/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
      const receitasAtivas = await prisma.receita.findMany({
        where: {
          ativo: 0, // somente receitas inativas
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
  
      return NextResponse.json(receitasAtivas);
    } catch (error) {
      console.error('Erro ao buscar receitas inativas:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar receitas inativas' },
        { status: 500 }
      );
    }
  }

