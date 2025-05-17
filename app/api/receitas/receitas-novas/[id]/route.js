// api/receitas/receitas-novas/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// receita nova por id

export const GET = async (req) => {
  const { id } = req.params; 

  try {
    const receitaNova = await prisma.receita.findUnique({
      where: {
        id_receita: Number(id),
        ativo: null, 
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

    if (!receitaNova) {
      return NextResponse.json({ error: 'Receita nova não encontrada por id' }, { status: 404 });
    }

    return NextResponse.json(receitaNova);
  } catch (error) {
    console.error('Erro ao buscar a receita nova por id:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar a receita nova por id' },
      { status: 500 }
    );
  }
}
