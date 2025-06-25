// app/api/admin/feedbacks/receita/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id_receita } = params;

        const feedbacks = await prisma.feedback.findMany({
            where: { id_receita: parseInt(id_receita) },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        img_usuario: true,
                        email: true,
                    }
                },
                receita: {
                    select: {
                        id_receita: true,
                        titulo_receita: true,
                    }
                }
            },
            orderBy: {
                data_cadastro: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: feedbacks
        });

    } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}