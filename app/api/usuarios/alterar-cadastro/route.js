// app/api/usuarios/alterar-cadastro/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Função para atualizar o cadastro do usuário
export const PUT = async (request) => {
  try {
    const data = await request.json(); // Pega todo o body de uma vez
    const { id, nome, email, senha, telefone, endereco, numero, cidade, estado, cep, img_usuario } = data; // Campos que podem ser atualizados

    // Atualizar o cadastro do usuário no banco
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        email,
        senha,
        telefone,
        endereco,
        numero,
        cidade,
        estado,
        cep,
        img_usuario,
      },
    });

    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar cadastro do usuário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar cadastro do usuário' }, { status: 500 });
  }
};
