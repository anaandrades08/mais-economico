//api/feedbacks/feedbacks-inativos/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const feedbacksInativos = await prisma.feedback.findMany({
      where: {
        ativo: 0 //feedbacks inativos
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

    return NextResponse.json(feedbacksInativos)
  } catch (error) {
    console.error('Erro ao buscar feedbacks inativos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar feedbacks inativos' },
      { status: 500 }
    )
  }

  
}


