// app/api/categorias/admin/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
export async function GET() {
    try {
      const categorias = await prisma.categoria.findMany();
  
      return NextResponse.json(categorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar categorias' },
        { status: 500 }
      );
    }
  }


  // POST: Criar nova categoria
export async function POST(request) {
    try {
      const data = await request.json();
      const novaCategoria = await prisma.categoria.create({
        data,
      });
      return NextResponse.json(novaCategoria, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return NextResponse.json(
        { error: 'Erro ao criar categoria' },
        { status: 500 }
      );
    }
  }
  
  // PUT: Atualizar uma categoria (espera id no body)
  export async function PUT(request) {
    try {
      const data = await request.json();
      const { id_categoria, ...dadosAtualizados } = data;
  
      if (!id_categoria) {
        return NextResponse.json(
          { error: 'ID da categoria é obrigatório' },
          { status: 400 }
        );
      }
  
      const categoriaAtualizada = await prisma.categoria.update({
        where: { id_categoria: Number(id_categoria) },
        data: dadosAtualizados,
      });
  
      return NextResponse.json(categoriaAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar categoria' },
        { status: 500 }
      );
    }
  }
  
  // DELETE: Deletar uma categoria (espera id no body)
  export async function DELETE(request) {
    try {
      const data = await request.json();
      const { id_categoria } = data;
  
      if (!id_categoria) {
        return NextResponse.json(
          { error: 'ID da categoria é obrigatório' },
          { status: 400 }
        );
      }
      //adicionar cascata
      await prisma.categoria.delete({
        where: { id_categoria: Number(id_categoria) },
      });
  
      return NextResponse.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar categoria' },
        { status: 500 }
      );
    }
  }
  