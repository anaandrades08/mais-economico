// app/api/usuarios/admin/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// exibir
const validateId = (id) => {
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return { valid: false, error: 'ID inválido' };
  }
  return { valid: true, id: parseInt(id) };
};

export async function GET(request, { params }) {
  try {
    const validation = validateId(params?.id);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }
    const usuario = await prisma.usuario.findUnique({
      where: { id: validation.id },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Erro GET:', error);
    return NextResponse.json(
      { success: false, error: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
//alterar
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

    const updateData = {
      nome: body.nome,
      email: body.email,
      tipo: parseInt(body.tipo || 2),
      ativo: parseInt(body.ativo || 0),
      endereco: body.endereco || null,
      numero: body.numero || null,
      cep: body.cep || null,
      cidade: body.cidade || null,
      estado: body.estado || null,
    };

    // if (body.senha?.trim()) {
    //   updateData.senha = body.senha.trim(); // Em produção, usar bcrypt
    //}

    const updated = await prisma.usuario.update({
      where: { id: validation.id },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro PUT:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao atualizar',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}
//delete
export async function DELETE(request, { params }) {
  try {
    const validation = validateId(params?.id);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe antes de deletar
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: validation.id },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Realizar a exclusão
    await prisma.usuario.delete({
      where: { id: validation.id },
    });

    return NextResponse.json(
      { success: true, message: 'Usuário excluído com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro DELETE:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao excluir usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}