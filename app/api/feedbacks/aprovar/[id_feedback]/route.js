// app/api/feedbacks/aprovar/[id_feedback]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// PUT - Aprovar feedback para aparecer no site
export async function PUT(request) {
    try {
      const { id_feedback } = await request.json();
  
      if (!id_feedback) {
        return NextResponse.json({ error: 'id do feedback é obrigatório' }, { status: 400 });
      }
  
      const Aprovar = await prisma.feedback.update({
        where: { id_feedback: Number(id_feedback) },
        data: { ativo: 1 }
      });
  
      return NextResponse.json({
        message: 'Status "ativo" do feedback atualizado com sucesso!',
        feedback: Aprovar
      });
    } catch (error) {
      console.error('Erro ao atualizar status do feedback:', error);
      return NextResponse.json({ error: 'Erro ao atualizar status do feedback' }, { status: 500 });
    }
  }