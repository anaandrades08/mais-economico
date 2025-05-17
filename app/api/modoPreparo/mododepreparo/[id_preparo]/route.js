// app/api/modoPreparo/[id_preparo]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - Lista os modos de preparo por id_preparo
export async function GET(request, { params }) {
    const { id_preparo } = params;
  
    try {
      // Verifica se o id_preparo é válido
      const modoPreparo = await prisma.modoPreparo.findUnique({
        where: { id_preparo: parseInt(id_preparo) },
        include: {
          tituloPreparo: {
            select: {
              id_titulo_preparo: true,
              titulo_preparo: true, // Se houver esse campo
            }
          }
        }
      });
  
      if (!modoPreparo) {
        return NextResponse.json(
          { error: 'Modo de preparo não encontrado' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(modoPreparo);
    } catch (error) {
      console.error('Erro ao buscar modo de preparo:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar modo de preparo' },
        { status: 500 }
      );
    }
  }
  
// PUT - Atualiza modo de preparo por id_preparo
export async function PUT(request, { params }) {
    const { id_preparo } = params;
  
    try {
      const data = await request.json(); // Pega os dados enviados no corpo da requisição
  
      const modoPreparoAtualizado = await prisma.modoPreparo.update({
        where: { id_preparo: parseInt(id_preparo) },
        data: {
          descricao_preparo: data.descricao_preparo, // exemplo de campo a ser atualizado
          // Adicione outros campos conforme necessário
        }
      });
  
      return NextResponse.json(modoPreparoAtualizado);
    } catch (error) {
      console.error('Erro ao alterar modo de preparo:', error);
      return NextResponse.json(
        { error: 'Erro ao alterar modo de preparo' },
        { status: 500 }
      );
    }
  }

// DELETE - Exclui modo de preparo por id_preparo
export async function DELETE(request, { params }) {
  const { id_preparo } = params;

  try {
    // Verifica se o modo de preparo existe antes de tentar deletar
    const modoPreparoExistente = await prisma.modoPreparo.findUnique({
      where: { id_preparo: parseInt(id_preparo) },
    });

    if (!modoPreparoExistente) {
      return NextResponse.json(
        { error: 'Modo de preparo não encontrado' },
        { status: 404 }
      );
    }

    // Deleta o modo de preparo
    await prisma.modoPreparo.delete({
      where: { id_preparo: parseInt(id_preparo) },
    });

    return NextResponse.json({ message: 'Modo de preparo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir modo de preparo:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir modo de preparo' },
      { status: 500 }
    );
  }
}
