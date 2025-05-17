// app/api/ingredientesReceita/[id_titulo_ingrediente_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Exibe o título de ingrediente com seus ingredientes
export async function GET(request, { params }) {
  const { id_titulo_ingrediente_receita } = params; // Pega o id_titulo_ingrediente_receita da URL
  try {
    // Busca o título do ingrediente e seus ingredientes associados
    const tituloIngrediente = await prisma.tituloIngredientesReceita.findUnique({
      where: {
        id_titulo_ingrediente_receita: parseInt(id_titulo_ingrediente_receita), // Filtra pelo id_titulo_ingrediente_receita
      },
      include: {
        ingredientes: {
          select: {
            id_ingrediente_receita: true,
            quantidade: true,
            ingrediente: {
              select: {
                descricao_ingrediente: true, // Seleciona a descrição do ingrediente
              },
            },
            unidadeMedida: {
              select: {
                unidade_medida: true,
                sigla: true, // Seleciona a unidade de medida e sua sigla
              },
            },
          },
        },
      },
    });

    if (!tituloIngrediente) {
      return NextResponse.json(
        { error: 'Título de ingrediente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(tituloIngrediente);
  } catch (error) {
    console.error('Erro ao buscar título de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar título de ingrediente' },
      { status: 500 }
    );
  }
}

// Cadastra um ingrediente para o título de ingrediente informado na URL
export async function POST(request, { params }) {
  const { id_titulo_ingrediente_receita } = params;

  try {
    const data = await request.json();

    const { id_ingrediente, quantidade, id_uni_medida } = data;

    // Validação básica
    if (!id_ingrediente || !quantidade || !id_uni_medida) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes: id_ingrediente, quantidade ou id_uni_medida.' },
        { status: 400 }
      );
    }

    const novoIngrediente = await prisma.ingredienteReceita.create({
      data: {
        id_ingrediente: parseInt(id_ingrediente),
        id_titulo_ingrediente_receita: parseInt(id_titulo_ingrediente_receita),
        quantidade: parseInt(quantidade),
        id_uni_medida: parseInt(id_uni_medida),
        data_cadastro: new Date()
      },
    });

    return NextResponse.json(novoIngrediente, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar ingrediente da receita:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar ingrediente da receita' },
      { status: 500 }
    );
  }
}


// Atualiza o título de ingrediente
export async function PUT(request, { params }) {
  const { id_titulo_ingrediente_receita } = params;

  try {
    const data = await request.json(); // Pega os dados enviados no corpo da requisição

    // Atualiza o título do ingrediente
    const tituloAtualizado = await prisma.tituloIngredientesReceita.update({
      where: {
        id_titulo_ingrediente_receita: parseInt(id_titulo_ingrediente_receita),
      },
      data: {
        titulo_ingrediente_receita: data.titulo_ingrediente_receita, // Atualiza o título
      },
    });

    return NextResponse.json(tituloAtualizado);
  } catch (error) {
    console.error('Erro ao alterar título de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar título de ingrediente' },
      { status: 500 }
    );
  }
}

// Deleta o título de ingrediente e seus ingredientes associados
export async function DELETE(request, { params }) {
  const { id_titulo_ingrediente_receita } = params;

  try {
    // Verifica se o título de ingrediente existe antes de tentar deletar
    const tituloExistente = await prisma.tituloIngredientesReceita.findUnique({
      where: {
        id_titulo_ingrediente_receita: parseInt(id_titulo_ingrediente_receita),
      },
      include: {
        ingredientes: true, // Inclui os ingredientes associados
      },
    });

    if (!tituloExistente) {
      return NextResponse.json(
        { error: 'Título de ingrediente não encontrado' },
        { status: 404 }
      );
    }

    // Deleta os ingredientes associados ao título
    await prisma.ingredienteReceita.deleteMany({
      where: {
        id_titulo_ingrediente_receita: parseInt(id_titulo_ingrediente_receita),
      },
    });

    // Deleta o título de ingrediente
    await prisma.tituloIngredientesReceita.delete({
      where: {
        id_titulo_ingrediente_receita: parseInt(id_titulo_ingrediente_receita),
      },
    });

    return NextResponse.json({
      message: 'Título de ingrediente e seus ingredientes excluídos com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir título de ingrediente e seus ingredientes:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir título de ingrediente e seus ingredientes' },
      { status: 500 }
    );
  }
}