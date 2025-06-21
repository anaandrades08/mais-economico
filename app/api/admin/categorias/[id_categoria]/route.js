// app/api/admin/categorias/[id_categoria]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
  try {
    // Acessa o parâmetro diretamente (não precisa de await)
    const { id_categoria } = params; // Isso já é acessado corretamente
    // Verifica se o ID foi fornecido
    if (!id_categoria) {
      return NextResponse.json(
        { success: false, error: 'ID da categoria não fornecido' },
        { status: 400 }
      );
    }

    // Busca a categoria com as receitas e dicas relacionadas
    const categoria = await prisma.categoria.findUnique({
      where: {
        id_categoria: parseInt(id_categoria),
      },
      include: {
        receitas: true,
        dicas: true,
      },
    });

    // Verifica se a categoria foi encontrada
    if (!categoria) {
      return NextResponse.json(
        { success: false, error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Retorna a categoria com sucesso
    return NextResponse.json({
      success: true,
      data: categoria,
    });

  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
};

// PUT: atualiza uma categoria existente
export const PUT = async (req, { params }) => {
  const { id_categoria } = params;

  try {
    // Verifica se o ID foi fornecido
    if (!id_categoria) {
      return NextResponse.json(
        { success: false, error: 'ID da categoria não fornecido' },
        { status: 400 }
      );
    }

    // Obtém os dados do corpo da requisição
    const body = await req.json();
    const { nome, link_categoria } = body;

    // Validação dos dados
    if (!nome && !link_categoria) {
      return NextResponse.json(
        { success: false, error: 'Nenhum dado fornecido para atualização' },
        { status: 400 }
      );
    }

    // Atualiza a categoria no banco de dados
    const updatedCategoria = await prisma.categoria.update({
      where: {
        id_categoria: parseInt(id_categoria),
      },
      data: {
        ...(nome && { nome }), // Atualiza apenas se nome foi fornecido
        ...(link_categoria && { link_categoria }), // Atualiza apenas se link foi fornecido
      },
    });

    // Retorna a categoria atualizada
    return NextResponse.json({
      success: true,
      data: updatedCategoria,
    });

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);

    // Tratamento de erros específicos
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
};

// app/api/admin/categorias/[id_categoria]/route.js
export async function DELETE(request, { params }) {
  const { id_categoria } = params;

  try {
    // Verifica associações de forma mais eficiente
    const [receitasCount, dicasCount] = await Promise.all([
      prisma.receita.count({ where: { id_categoria: parseInt(id_categoria) } }),
      prisma.dica.count({ where: { id_categoria: parseInt(id_categoria) } })
    ]);

    if (receitasCount > 0 || dicasCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Não é possível deletar a categoria',
        details: {
          hasRecipes: receitasCount > 0,
          hasTips: dicasCount > 0,
          recipesCount: receitasCount,
          tipsCount: dicasCount
        }
      }, { status: 400 });
    }

    const deleteCategoria = await prisma.categoria.delete({
      where: { id_categoria: parseInt(id_categoria) },
    });

    return NextResponse.json({
      success: true,
      message: `Categoria "${deleteCategoria.nome}" deletada com sucesso.`,
      deletedId: deleteCategoria.id_categoria
    });

  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return NextResponse.json({
      success: false,
      error: error.code === 'P2025' 
        ? 'Categoria não encontrada' 
        : 'Erro ao deletar categoria'
    }, { status: error.code === 'P2025' ? 404 : 500 });
  }
}