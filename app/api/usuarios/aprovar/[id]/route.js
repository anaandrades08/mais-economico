// app/api/usuarios/aprovar/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Helper function to validate ID
function validateId(id) {
  if (!id) return { valid: false, error: 'ID do usuário não fornecido' };
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return { valid: false, error: 'ID inválido' };
  return { valid: true, id: parsedId };
}

export async function PUT(request, { params }) {
  try {
    const validation = validateId(params?.id);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const body = await request.json();
    const ativo = parseInt(body.ativo);
    
    // Validate ativo value
    if (![0, 1, 2].includes(ativo)) {
      return NextResponse.json(
        { success: false, error: 'Valor de ativo inválido. Deve ser 0, 1 ou 2' },
        { status: 400 }
      );
    }

     // checa se usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id: validation.id },
      select: { id: true }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const updated = await prisma.usuario.update({
      where: { id: validation.id },
      data: { ativo },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true
      }
    });

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar status do usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}