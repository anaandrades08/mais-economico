//app/api/dicas/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// Função para obter todas as dicas
export const GET = async (req) => {
  try {
    const dicas = await prisma.dica.findMany();
    return NextResponse.json(dicas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar dicas' }, { status: 500 });
  }
};

// Função para criar uma nova dica
export const POST = async (req) => {
  const body = await req.json();
  try {
    const novaDica = await prisma.dica.create({
      data: body,
    });
    return NextResponse.json(novaDica, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar dica' }, { status: 500 });
  }
};


// Função para alterar uma dica
export const PUT = async (req) => {
  const { id } = req.params;
  const body = await req.json();
  try {
    const dicaAtualizada = await prisma.dica.update({
      where: { id_dica: parseInt(id) },
      data: body,
    });
    return NextResponse.json(dicaAtualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar dica' }, { status: 500 });
  }
};

// Função para deletar uma dica
export const DELETE = async (req) => {
  const { id } = req.params;
  try {
    await prisma.dica.delete({
      where: { id_dica: parseInt(id) },
    });
    return NextResponse.json({ message: 'Dica deletada com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar dica' }, { status: 500 });
  }
};
