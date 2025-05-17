// app/api/ingredientesReceita/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// Exibe todos os títulos de ingredientes com ingredientes, unidade de medida e receita associada
export async function GET() {
  try {
    const titulosIngredientes = await prisma.tituloIngredientesReceita.findMany({
      select: {
        id_titulo_ingrediente_receita: true,
        titulo_ingrediente_receita: true,
        include: {
          receita: {
            select: {
              id_receita: true,
              titulo_receita: true
            }
          },
          ingredientes: {
            select: {
              id_ingrediente_receita: true,
              quantidade: true,
              ingrediente: {
                select: {
                  descricao_ingrediente: true

                }
              },
              unidadeMedida: {
                select: {
                  unidade_medida: true,
                  sigla: true
                }
              }
            }
          }
        }
      },
    });

    if (titulosIngredientes.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum título de ingrediente encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(titulosIngredientes);
  } catch (error) {
    console.error('Erro ao buscar títulos de ingredientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar títulos de ingredientes' },
      { status: 500 }
    );
  }
}
