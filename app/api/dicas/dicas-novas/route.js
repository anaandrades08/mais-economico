//dicas/dicas-novas/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const dicasNovas = await prisma.dica.findMany({
      where: {
        ativo: null //dicas novas
      },
      orderBy: {
        data_cadastro: 'desc' //ordenar por data de cadastro descrescente
      },
      select: {
        id_dica: true,
        titulo: true,
        descricao: true,
        cta_text: true,
        img_dica: true,
        data_cadastro: true,
        id_categoria: true,
        id_usuario: true,
        usuario: {
          select: {
            nome: true // <-- aqui pegando o nome do usuário
          }
        },
        categoria: {
          select: {
            nome: true // <-- aqui pegando o nome da categoria
          }
        }
      }
    })

    return NextResponse.json(dicasNovas)
  } catch (error) {
    console.error('Erro ao buscar dicas novas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dicas novas' },
      { status: 500 }
    )
  }

  
}


