// app/api/usuarios/aprovar/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// PUT - Aprovar usuárop para acessar o site
export async function PUT(request) {
    try {
      const { id } = await request.json();
  
      if (!id) {
        return NextResponse.json({ error: 'id do usuário é obrigatório' }, { status: 400 });
      }
  
      const Aprovar = await prisma.usuario.update({
        where: { id: Number(id) },
        data: { ativo: 1 }
      });
  
      return NextResponse.json({
        message: 'Status "ativo" do usuário atualizado com sucesso!',
        usuario: Aprovar
      });
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      return NextResponse.json({ error: 'Erro ao atualizar status do usuário' }, { status: 500 });
    }
  }