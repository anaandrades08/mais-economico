// app/api/ingredientes/[id_tipo_ingrediente]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Exibe ingredientes filtrados pelo id_tipo_ingrediente
export async function GET(request, { params }) {
    const { id_tipo_ingrediente } = params; // Pega o id_tipo_ingrediente da URL
    try {
      // Busca os ingredientes com base no id_tipo_ingrediente
      const ingredientes = await prisma.ingrediente.findMany({
        where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) }, // Filtro pelo id_tipo_ingrediente
        select: {
          id_ingrediente: true,
          id_tipo_ingrediente: true,
          descricao_ingrediente: true,
          valor: true,
          quantidade: true,
          id_uni_medida: true,
          tipoIngrediente: {
            select: {
              tipo_ingrediente: true,
            },
          },
          unidadeMedida: {
            select: {
              unidade_medida: true,
              sigla: true,
            },
          },
        },
      });
  
      if (ingredientes.length === 0) {
        return NextResponse.json({ error: 'Nenhum ingrediente encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(ingredientes);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar ingredientes' },
        { status: 500 }
      );
    }
  }


// POST - Cria um novo ingrediente
export async function POST(request, { params }) {
  const { id_tipo_ingrediente } = params; // Pega o id_tipo_ingrediente da URL
  try {
    const body = await request.json();
    const { descricao_ingrediente, valor, quantidade, id_uni_medida } = body;

    // Validação de dados
    if (!descricao_ingrediente || typeof descricao_ingrediente !== 'string') {
      return NextResponse.json(
        { error: 'O campo descricao_ingrediente é obrigatório e deve ser uma string.' },
        { status: 400 }
      );
    }

    if (isNaN(valor) || valor <= 0) {
      return NextResponse.json(
        { error: 'O campo valor deve ser um número positivo.' },
        { status: 400 }
      );
    }

    if (isNaN(quantidade) || quantidade < 0) {
      return NextResponse.json(
        { error: 'O campo quantidade deve ser um número não negativo.' },
        { status: 400 }
      );
    }

    // Criação do novo ingrediente
    const novoIngrediente = await prisma.ingrediente.create({
      data: {
        descricao_ingrediente,
        valor,
        quantidade,
        id_uni_medida,
        id_tipo_ingrediente: parseInt(id_tipo_ingrediente), // Relaciona com o tipo de ingrediente
      },
    });

    return NextResponse.json(novoIngrediente, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ingrediente.' },
      { status: 500 }
    );
  }
}


// PUT - Atualiza o tipo de ingrediente
export async function PUT(request, { params }) {
  const { id_tipo_ingrediente } = params; // Pega o id_tipo_ingrediente da URL
  try {
    const body = await request.json();
    const { novoTipoIngrediente } = body;

    // Validação de dados
    if (!novoTipoIngrediente || typeof novoTipoIngrediente !== 'string') {
      return NextResponse.json(
        { error: 'O campo novoTipoIngrediente é obrigatório e deve ser uma string.' },
        { status: 400 }
      );
    }

    // Atualização do tipo de ingrediente
    const tipoIngredienteAtualizado = await prisma.tipoIngrediente.update({
      where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
      data: { tipo_ingrediente: novoTipoIngrediente },
    });

    return NextResponse.json(tipoIngredienteAtualizado, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar tipo de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tipo de ingrediente.' },
      { status: 500 }
    );
  }
}


// DELETE - Deleta o tipo de ingrediente e seus ingredientes, incluindo substituições e ingredientes de receita
export async function DELETE(request, { params }) {
  const { id_tipo_ingrediente } = params; // Pega o id_tipo_ingrediente da URL
  try {
    // 1. Deleta as substituições associadas aos ingredientes deste tipo
    await prisma.substituicao.deleteMany({
      where: {
        id_ingrediente: {
          in: await prisma.ingrediente.findMany({
            where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
            select: { id_ingrediente: true },
          }).then((ingredientes) => ingredientes.map((ingrediente) => ingrediente.id_ingrediente)),
        },
      },
    });

    // 2. Deleta os ingredientes associados a este tipo de ingrediente nas receitas
    await prisma.ingredienteReceita.deleteMany({
      where: {
        id_ingrediente: {
          in: await prisma.ingrediente.findMany({
            where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
            select: { id_ingrediente: true },
          }).then((ingredientes) => ingredientes.map((ingrediente) => ingrediente.id_ingrediente)),
        },
      },
    });

    // 3. Deleta os ingredientes associados a esse tipo de ingrediente
    await prisma.ingrediente.deleteMany({
      where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
    });

    // 4. Deleta o tipo de ingrediente
    const tipoIngredienteDeletado = await prisma.tipoIngrediente.delete({
      where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
    });

    return NextResponse.json(tipoIngredienteDeletado, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar tipo de ingrediente e suas dependências:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar tipo de ingrediente e suas dependências.' },
      { status: 500 }
    );
  }
}