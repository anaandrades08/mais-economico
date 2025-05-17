// app/api/categorias/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
//função para exibir todas as categorias
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany();

    return new Response(JSON.stringify(categorias), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Falha ao carregar categorias" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
  


