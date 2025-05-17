// app/api/usuarios/alterar-senha/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Função para atualizar senha do usuário
export const PUT = async (request) => {
  try {
    const { id } = await request.json(); // pegar o ID no body, não em params
    const { senha } = await request.json(); // Também pegar a nova senha no body

    // Atualizar a senha do usuário no banco
    const senhaAtualizada = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        senha: senha
      },
    });

    return NextResponse.json(senhaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar senha do usuário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar senha do usuário' }, { status: 500 });
  }
};
