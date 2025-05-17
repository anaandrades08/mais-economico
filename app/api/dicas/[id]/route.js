
//app/api/dicas/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
export const GET = async (req) => {
  const { id } = req.params; 
  try {
    const dica = await prisma.dica.findUnique({
      where: { id_dica: parseInt(id) },
    });
    if (!dica) {
      return NextResponse.json({ error: 'Dica não encontrada' }, { status: 404 });
    }
    return NextResponse.json(dica);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar dica' }, { status: 500 });
  }
};
