// app/api/unidadeMedida/[id_uni_medida]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const GET = async (req) => {
    const { id_uni_medida } = req.params; 
    try {
      const unidadeMedidas = await prisma.unidadeMedida.findUnique({
        where: { id_uni_medida: parseInt(id_uni_medida) },
      });
      if (!unidadeMedidas) {
        return NextResponse.json({ error: 'Unidade de medida não encontrada' }, { status: 404 });
      }
      return NextResponse.json(unidadeMedidas);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Erro ao buscar unidade de medida' }, { status: 500 });
    }
  };

  // Altera unidade de medida pelo id_uni_medida
export const PUT = async (req, { params }) => {
  const { id_uni_medida } = params;  // Pega o id da URL
  try {
    const data = await req.json();

    // Atualiza a unidade de medida no banco de dados
    const unidadedemedidaAtualizada = await prisma.unidadeMedida.update({
      where: { id_uni_medida: parseInt(id_uni_medida) },
      data: {
        sigla: data.sigla, 
        unidade_medida: data.unidade_medida  
      },
    });

    // Retorna a unidade de medida atualizada
    return NextResponse.json(unidadedemedidaAtualizada);
  } catch (error) {
    console.error('Erro ao alterar unidade de medida:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar unidade de medida' },
      { status: 500 }
    );
  }
};

//fazer o deletar