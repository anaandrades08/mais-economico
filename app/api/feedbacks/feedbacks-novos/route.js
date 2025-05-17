//api/feedbacks/feedbacks-novos/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        ativo: null //feedbacks novos
      },
      orderBy: {
        data_cadastro: 'desc' //ordenar por data de cadastro descrescente
      },
      select: {
        id_feedback: true,
        feedback: true,
        total_estrela: true,
        data_cadastro: true,
        id_receita: true,
        id_usuario: true,
        usuario: {
          select: {
            nome: true // <-- aqui pegando o nome do usuário
          }
        },
        receita: {
          select: {
            titulo_receita: true // <-- aqui pegando o nome da receita
          }
        }
      }
    })

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error('Erro ao buscar feedbacks novos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar feedbacks novos' },
      { status: 500 }
    )
  }

  
}


