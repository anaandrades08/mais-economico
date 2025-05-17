// api/receitas/receitas-reprovadas/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// receita reprovada por id

export const GET = async (req) => {
  const { id } = req.params; 

  try {
    const receitaReprovada = await prisma.receita.findUnique({
      where: {
        id_receita: Number(id),
        ativo: 2, 
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

    if (!receitaReprovada) {
      return NextResponse.json({ error: 'Receita reprovada não encontrada' }, { status: 404 });
    }

    return NextResponse.json(receitaAtiva);
  } catch (error) {
    console.error('Erro ao buscar a receita reprovada por id:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar a receita reprovada por id' },
      { status: 500 }
    );
  }
}
