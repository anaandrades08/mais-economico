import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: exibe a categoria com suas receitas ou todas as categorias se o id_categoria for 0
export const GET = async () => {
    try {
      // Consulta todas as receitas ativas
      const receitas = await prisma.receita.findMany({
        where: {
          ativo: 1,  // Só as receitas ativas
        },
        orderBy: {
          data_cadastro: 'desc',  // Ordena pela data de cadastro (ou outro critério)
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
      });
  
      return NextResponse.json({
        nome_categoria: "Todas as Receitas",  // Nome fixo para categoria 0
        receitas: receitas || [],
      });
    } catch (error) {
      console.error('Erro ao buscar todas as receitas:', error);
      return NextResponse.json(
        { error: 'Erro interno ao buscar receitas.' },
        { status: 500 }
      );
    }
  };