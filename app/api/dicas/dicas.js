import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const dicasAtivas = await prisma.dica.findMany({
            where: {
                ativa: true // Supondo que exista um campo booleano 'ativa' no modelo Dica
            },
            // Opcional: incluir ordenação ou seleção de campos específicos
            orderBy: {
                createdAt: 'desc' // Ordena pelas mais recentes primeiro
            },
            // Opcional: selecionar apenas os campos necessários
            select: {
                id: true,
                titulo: true,
                conteudo: true,
                createdAt: true
                // Adicione outros campos conforme necessário
            }
        })

        return NextResponse.json(dicasAtivas)
    } catch (error) {
        console.error('Erro ao buscar dicas ativas:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar dicas ativas' }, 
            { status: 500 }
        )
    }
}