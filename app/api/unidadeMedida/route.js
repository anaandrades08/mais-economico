// app/api/unidadeMedida/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
export async function GET() {
    try {
      const unidadeMedidas = await prisma.unidadeMedida.findMany();
  
      return NextResponse.json(unidadeMedidas);
    } catch (error) {
      console.error('Erro ao buscar unidade de medidas:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar unidade de medidas' },
        { status: 500 }
      );
    }
  }

// POST: Criar nova unidade de medida
export async function POST(request) {
    try {
      const data = await request.json();
      const novaUnidade = await prisma.unidadeMedida.create({
        data,
      });
      return NextResponse.json(novaUnidade, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar unidade de medida:', error);
      return NextResponse.json(
        { error: 'Erro ao criar unidade de medida' },
        { status: 500 }
      );
    }
  }