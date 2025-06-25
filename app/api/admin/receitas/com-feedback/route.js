// app/api/admin/receitas/com-feedback/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const perPage = parseInt(searchParams.get('perPage')) || 12;

        // Busca receitas que têm pelo menos um feedback
        const receitas = await prisma.receita.findMany({
            where: {
                feedbacks: {
                    some: {} // Pelo menos um feedback
                }
            },
            include: {
                _count: {
                    select: { feedbacks: true }
                }
            },
            orderBy: {
                feedbacks: {
                    _count: 'desc'
                }
            },
            skip: (page - 1) * perPage,
            take: perPage
        });

        const total = await prisma.receita.count({
            where: {
                feedbacks: {
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
        console.error('Erro ao buscar receitas com feedback:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}