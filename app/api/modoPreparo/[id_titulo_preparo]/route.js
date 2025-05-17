// app/api/modoPreparo/[id_titulo_preparo]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Lista os títulos de preparo por id_titulo_preparo
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idTitulo = parseInt(searchParams.get('id_titulo_preparo'));

    if (isNaN(idTitulo)) {
      return NextResponse.json(
        { error: 'Parâmetro id do título de preparo inválido ou ausente.' },
        { status: 400 }
      );
    }

    const titulosComModos = await prisma.tituloPreparo.findMany({
      where: {
        id_titulo_preparo: idTitulo
      },
      include: {
        modosPreparo: {
          select: {
            id_preparo: true,
            descricao_preparo: true,
            data_cadastro: true,
          }
        },
        receita: {
          select: {
            id_receita: true,
            titulo_receita: true, 
          }
        }
      }
    });

    return NextResponse.json(titulosComModos);
  } catch (error) {
    console.error('Erro ao buscar modos de preparo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar modos de preparo' },
      { status: 500 }
    );
  }
}

// POST - Cria um modo de preparo associado a um id_titulo_preparo
export async function POST(request, { params }) {
  const { id_titulo_preparo } = params;

  try {
    const data = await request.json();
    const { descricao_preparo } = data;

    const idTitulo = parseInt(id_titulo_preparo);
    if (isNaN(idTitulo)) {
      return NextResponse.json(
        { error: 'ID do título de preparo inválido.' },
        { status: 400 }
      );
    }

    // Verifica se o título de preparo existe
    const titulo = await prisma.tituloPreparo.findUnique({
      where: { id_titulo_preparo: idTitulo }
    });

    if (!titulo) {
      return NextResponse.json(
        { error: 'Título de preparo não encontrado.' },
        { status: 404 }
      );
    }

    // Cria o modo de preparo
    const novoModo = await prisma.modoPreparo.create({
      data: {
        id_titulo_preparo: idTitulo,
        descricao_preparo: descricao_preparo
      }
    });

    return NextResponse.json(novoModo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar modo de preparo:', error);
    return NextResponse.json(
      { error: 'Erro ao criar modo de preparo' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza título de preparo por id_titulo_preparo
export async function PUT(request, { params }) {
  const { id_titulo_preparo } = params;

  try {
    const data = await request.json(); // Pega os dados enviados no corpo da requisição

    const tituloAtualizado = await prisma.tituloPreparo.update({
      where: { id_titulo_preparo: parseInt(id_titulo_preparo) },
      data: {
        titulo_preparo: data.titulo_preparo, // exemplo de campo a ser atualizado
        // Adicione outros campos conforme necessário
      }
    });

    return NextResponse.json(tituloAtualizado);
  } catch (error) {
    console.error('Erro ao alterar título de preparo:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar título de preparo' },
      { status: 500 }
    );
  }
}

// DELETE - Exclui título de preparo e seus modos de preparo por id_titulo_preparo
export async function DELETE(request, { params }) {
    const { id_titulo_preparo } = params;
  
    try {
      // Verifica se o título de preparo existe antes de tentar deletar
      const tituloExistente = await prisma.tituloPreparo.findUnique({
        where: { id_titulo_preparo: parseInt(id_titulo_preparo) },
        include: {
          modosPreparo: true, // Inclui os modos de preparo associados
        },
      });
  
      if (!tituloExistente) {
        return NextResponse.json(
          { error: 'Título de preparo não encontrado' },
          { status: 404 }
        );
      }
  
      // Deleta todos os modos de preparo associados ao título
      await prisma.modoPreparo.deleteMany({
        where: { id_titulo_preparo: parseInt(id_titulo_preparo) },
      });
  
      // Agora deleta o título de preparo
      await prisma.tituloPreparo.delete({
        where: { id_titulo_preparo: parseInt(id_titulo_preparo) },
      });
  
      return NextResponse.json({ message: 'Título de preparo e seus modos excluídos com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir título de preparo e modos:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir título de preparo e modos de preparo' },
        { status: 500 }
      );
    }
  }
  