import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export const GET = async () => {
  try {
    const receitas = await prisma.receita.findMany({
      where: {
        ativo: 1 // Apenas receitas ativas
      },
      include: {
        categoria: {
          select: {
            nome: true
          }
        },
        usuario: {
          select: {
            nome: true
          }
        },
        titulosIngrediente: {
          include: {
            ingredientes: {
              include: {
                ingrediente: {
                  select: {
                    descricao_ingrediente: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        data_cadastro: 'desc' // Ordena por mais recentes
      }
    });

    return NextResponse.json({ receitas });
    
  } catch (error) {
    console.error('Erro na API de busca:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar receitas' },
      { status: 500 }
    );
  }
};