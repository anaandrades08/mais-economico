// app/api/receitas/aprovar/[id_receita]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// PUT - Aprovar receita para aparecer no site
export async function PUT(request) {
    try {
      const { id_receita } = await request.json();
  
      if (!id_receita) {
        return NextResponse.json({ error: 'id_receita é obrigatório' }, { status: 400 });
      }
  
      const receitaAtualizada = await prisma.receita.update({
        where: { id_receita: Number(id_receita) },
        data: { ativo: 1 }
      });
  
      return NextResponse.json({
        message: 'Status "ativo" da receita atualizado com sucesso!',
        receita: receitaAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar status da receita:', error);
      return NextResponse.json({ error: 'Erro ao atualizar status da receita' }, { status: 500 });
    }
  }