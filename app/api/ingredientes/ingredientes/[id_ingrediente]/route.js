// app/api/ingredientes/[id_ingrediente]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

////// Exibe ingrediente pelo id_ingrediente
export async function GET(request, { params }) {
    const { id_ingrediente } = params; // Pega o id_ingrediente da URL
    try {
      const ingredientes = await prisma.ingrediente.findMany({
        where: { id_ingrediente: parseInt(id_ingrediente) }, 
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
        return NextResponse.json({ error: 'Ingrediente não encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(ingredientes);
    } catch (error) {
      console.error('Erro ao buscar ingrediente:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar ingrediente' },
        { status: 500 }
      );
    }
  }


///////// Altera ingrediente pelo id_ingrediente
export async function PUT(request, { params }) {
    const { id_ingrediente } = params; // Pega o id_ingrediente da URL
  
    try {
      // Lê o corpo da requisição, que deve conter os dados a serem atualizados
      const data = await request.json();
  
      // Atualiza o ingrediente no banco de dados
      const ingredienteAtualizado = await prisma.ingrediente.update({
        where: { id_ingrediente: parseInt(id_ingrediente) },
        data: {
          id_tipo_ingrediente: data.id_tipo_ingrediente,
          descricao_ingrediente: data.descricao_ingrediente,
          valor: data.valor,
          quantidade: data.quantidade,
          id_uni_medida: data.id_uni_medida,
        },
      });
  
      // Retorna o ingrediente atualizado
      return NextResponse.json(ingredienteAtualizado);
    } catch (error) {
      console.error('Erro ao alterar ingrediente:', error);
      return NextResponse.json(
        { error: 'Erro ao alterar ingrediente' },
        { status: 500 }
      );
    }
  }

  // Deleta o ingrediente pelo id_ingrediente, com cascata nas dependências (Substituicao, IngredienteReceita)
export async function DELETE(request, { params }) {
  const { id_ingrediente } = params; // Pega o id_ingrediente da URL
  try {
    // 1. Deleta as substituições associadas a esse ingrediente
    await prisma.substituicao.deleteMany({
      where: {
        id_ingrediente: parseInt(id_ingrediente),
      },
    });

    // 2. Deleta os registros de ingrediente em receitas associadas a esse ingrediente
    await prisma.ingredienteReceita.deleteMany({
      where: {
        id_ingrediente: parseInt(id_ingrediente),
      },
    });

    // 3. Deleta o ingrediente
    const ingredienteDeletado = await prisma.ingrediente.delete({
      where: { id_ingrediente: parseInt(id_ingrediente) },
    });

    // Retorna a confirmação da exclusão
    return NextResponse.json(ingredienteDeletado, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar ingrediente e suas dependências:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar ingrediente e suas dependências.' },
      { status: 500 }
    );
  }
}