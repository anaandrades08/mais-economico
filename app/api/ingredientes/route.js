// app/api/ingredientes/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Exibe todos os tipos de ingredientes com seus ingredientes associados
export async function GET() {
  try {
    const tiposComIngredientes = await prisma.tipoIngrediente.findMany({
      include: {
        ingredientes: {
          select: {
            id_ingrediente: true,            
            id_tipo_ingrediente: true,
            descricao_ingrediente: true,
            valor: true,
            quantidade: true,
            unidadeMedida: {
              select: {
                id_uni_medida: true,
                unidade_medida: true,
                sigla: true
              }
            }
          }
        }
      }
    });

    if (tiposComIngredientes.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum tipo de ingrediente encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(tiposComIngredientes);
  } catch (error) {
    console.error('Erro ao buscar tipos de ingredientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tipos de ingredientes.' },
      { status: 500 }
    );
  }
}

// POST - Cria um novo Tipo de Ingrediente
export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo_ingrediente } = body;

    // Validação simples
    if (!tipo_ingrediente || typeof tipo_ingrediente !== 'string') {
      return NextResponse.json(
        { error: 'Campo tipo_ingrediente é obrigatório e deve ser uma string.' },
        { status: 400 }
      );
    }

    const novoTipo = await prisma.tipoIngrediente.create({
      data: {
        tipo_ingrediente,
      },
    });

    return NextResponse.json(novoTipo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tipo de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tipo de ingrediente.' },
      { status: 500 }
    );
  }
}
