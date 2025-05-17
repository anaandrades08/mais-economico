// app/api/ingredientesSubstituicao/aprovar/[id_substituicao]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// PUT - Aprovar substituicao para aparecer no site
export async function PUT(request) {
    try {
      const { id_substituicao } = await request.json();
  
      if (!id_substituicao) {
        return NextResponse.json({ error: 'id de substituição é obrigatório' }, { status: 400 });
      }
  
      const Aprovar = await prisma.substituicao.update({
        where: { id_substituicao: Number(id_substituicao) },
        data: { ativo: 1 }
      });
  
      return NextResponse.json({
        message: 'Status "ativo" do ingrediente de substituição atualizado com sucesso!',
        substituicao: Aprovar
      });
    } catch (error) {
      console.error('Erro ao atualizar status do ingrediente de substituição:', error);
      return NextResponse.json({ error: 'Erro ao atualizar status do ingrediente de substituicao' }, { status: 500 });
    }
  }