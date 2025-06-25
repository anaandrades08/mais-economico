// app/api/admin/receitas/com-substituicao/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const perPage = parseInt(searchParams.get('perPage')) || 12;

        // Busca receitas que têm pelo menos uma substituição
        const receitas = await prisma.receita.findMany({
            where: {
                substituicoes: {
                    some: {} // Pelo menos uma substituição
                }
            },
            include: {
                _count: {
                    select: { substituicoes: true }
                }
            },
            orderBy: {
                substituicoes: {
                    _count: 'desc'
                }
            },
            skip: (page - 1) * perPage,
            take: perPage
        });

        const total = await prisma.receita.count({
            where: {
                substituicoes: {
                    some: {}
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: receitas,
            pagination: {
                page,
                perPage,
                total,
                totalPages: Math.ceil(total / perPage)
            }
        });

    } catch (error) {
        console.error('Erro ao buscar receitas com substituição:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}