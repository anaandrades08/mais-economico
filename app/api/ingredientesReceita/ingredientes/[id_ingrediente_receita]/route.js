// app/api/ingredientesReceita/[id_ingrediente_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

////// Exibe ingrediente pelo id_ingrediente_receita
export async function GET(request, { params }) {
    const { id_ingrediente_receita } = params; // Pega o id_ingrediente_receita da URL
    try {
      const ingredientes = await prisma.ingrediente.findMany({
        where: { id_ingrediente_receita: parseInt(id_ingrediente_receita) }, 
        select: {
            id_ingrediente_receita: true,
            id_ingrediente: true,
            id_titulo_ingrediente_receita: true,
            quantidade: true,
            id_uni_medida: true,
            data_cadastro: true,
            tituloIngrediente:{
              select: {
                  titulo_ingrediente_receita: true,
                  id_receita: true,
              }
            },
            ingrediente: {
              select: {
                  descricao_ingrediente: true 
              }
            },
            unidadeMedida: {
              select: {
                  unidade_medida: true,
                  sigla: true,
              }
            }
          }
        });
  
      if (ingredientes.length === 0) {
        return NextResponse.json({ error: 'Ingrediente da receita não encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(ingredientes);
    } catch (error) {
      console.error('Erro ao buscar ingrediente da receita:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar ingrediente da receita' },
        { status: 500 }
      );
    }
  }


///////// Altera ingrediente pelo id_ingrediente_receita
export async function PUT(request, { params }) {
    const { id_ingrediente_receita } = params;
  
    try {
      const data = await request.json();
  
      const ingredienteAtualizado = await prisma.ingredienteReceita.update({
        where: { id_ingrediente_receita: parseInt(id_ingrediente_receita) },
        data: {
          id_ingrediente: data.id_ingrediente,
          id_titulo_ingrediente_receita: data.id_titulo_ingrediente_receita,
          quantidade: data.quantidade,
          id_uni_medida: data.id_uni_medida,
        },
      });
  
      return NextResponse.json(ingredienteAtualizado);
    } catch (error) {
      console.error('Erro ao alterar ingrediente da receita:', error);
      return NextResponse.json(
        { error: 'Erro ao alterar ingrediente da receita' },
        { status: 500 }
      );
    }
  }
  
  ///////// Exclui ingrediente da receita pelo id_ingrediente_receita
export async function DELETE(request, { params }) {
    const { id_ingrediente_receita } = params;
  
    try {
      // Verifica se o ingrediente existe antes de tentar deletar
      const ingredienteExistente = await prisma.ingredienteReceita.findUnique({
        where: { id_ingrediente_receita: parseInt(id_ingrediente_receita) }
      });
  
      if (!ingredienteExistente) {
        return NextResponse.json(
          { error: 'Ingrediente da receita não encontrado' },
          { status: 404 }
        );
      }
  
      await prisma.ingredienteReceita.delete({
        where: { id_ingrediente_receita: parseInt(id_ingrediente_receita) }
      });
  
      return NextResponse.json({ message: 'Ingrediente da receita excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir ingrediente da receita:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir ingrediente da receita' },
        { status: 500 }
      );
    }
  }
  