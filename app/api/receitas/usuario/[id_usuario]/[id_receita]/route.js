// api/receita/usuario/[id_usuario]/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';


// Função para obter receita pelo ID da receita e ID do usuário
export const GET = async (request, { params }) => {
  try {
    const { id_receita, id_usuario } = await params;

    if (!id_receita) {
      return NextResponse.json({ error: 'ID da receita não encontrado' }, { status: 400 });
    }
    if (!id_usuario) {
      return NextResponse.json({ error: 'ID do usuário não encontrado' }, { status: 400 });
    }
    const receita = await prisma.receita.findUnique({
      where: {
        id_receita: parseInt(id_receita),
        id_usuario: parseInt(id_usuario),
      },
      include: {
        categoria: { select: { nome: true } },
      },
    });

    if (!receita) {
      return NextResponse.json({ error: 'Receita não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      receita: {
        id_receita: receita.id_receita,
        id_categoria: receita.id_categoria,
        titulo_receita: receita.titulo_receita,
        descricao_receita: receita.descricao_receita,
        tempo_preparo: receita.tempo_preparo,
        tempo_total: receita.tempo_total,
        rendimento: receita.rendimento,
        custo: receita.custo,
        dificuldade: receita.dificuldade,
        img_receita: receita.img_receita,
        aceito_termo: receita.aceito_termo,
        ativo: receita.ativo,
        data_cadastro: receita.data_cadastro,
        titulo_categoria: receita.categoria.nome,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar receita do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar receita do usuário' },
      { status: 500 }
    );
  }
};
// Função para alterar receita pelo ID da receita e ID do usuário
export const PUT = async (request, { params }) => {
  try {
    const { id_receita, id_usuario } = await params;
    if (!id_receita) {
      return NextResponse.json({ error: 'ID da receita não encontrada' }, { status: 400 });
    }
    if (!id_usuario) {
      return NextResponse.json({ error: 'ID do usuário não encontrado' }, { status: 400 });
    }

    const data = await request.json();

    const {
      id_categoria,
      titulo_receita,
      descricao_receita,
      tempo_preparo,
      tempo_total,
      rendimento,
      custo,
      dificuldade,
      img_receita,
      ativo,
    } = data;

    const receitaAtualizada = await prisma.receita.update({
      where: {
        id_receita: parseInt(id_receita),
        id_usuario: parseInt(id_usuario),
      },
      data: {
        id_categoria,
        titulo_receita,
        descricao_receita,
        tempo_preparo,
        tempo_total,
        rendimento,
        custo,
        dificuldade,
        img_receita,
        ativo,
        //data_atualizacao: new Date(), // supondo que você tenha esse campo no banco
      },
    });

    return NextResponse.json({ message: 'Receita atualizada com sucesso', receitaAtualizada });
  } catch (error) {
    console.error('Erro ao alterar receita:', error);
    return NextResponse.json({ error: 'Erro interno ao alterar receita' }, { status: 500 });
  }
};