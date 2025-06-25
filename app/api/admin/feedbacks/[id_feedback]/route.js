// app/api/admin/feedbacks/[id_feedback]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Obter detalhes do feedback
export async function GET(request, { params }) {
    try {
        const { id_feedback } = params;

        if (!id_feedback || isNaN(parseInt(id_feedback))) {
            return NextResponse.json(
                { success: false, error: 'ID do feedback inválido' },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.findUnique({
            where: { id_feedback: parseInt(id_feedback) },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                receita: {
                    select: {
                        id_receita: true,
                        titulo_receita: true,
                        img_receita: true
                    }
                }
            }
        });

        if (!feedback) {
            return NextResponse.json(
                { success: false, error: 'Feedback não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: feedback
        });

    } catch (error) {
        console.error('Erro ao buscar feedback:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// Atualizar feedback
export async function PUT(request, { params }) {
    try {
        const { id_feedback } = params;

        if (!id_feedback || isNaN(parseInt(id_feedback))) {
            return NextResponse.json(
                { success: false, error: 'ID do feedback inválido' },
                { status: 400 }
            );
        }

        const { feedback, ativo, observacao_admin } = await request.json();

        // Validações
        if (!feedback || typeof feedback !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Conteúdo do feedback inválido' },
                { status: 400 }
            );
        }

        if (![0, 1, 2, 3].includes(parseInt(ativo))) {
            return NextResponse.json(
                { success: false, error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updatedFeedback = await prisma.feedback.update({
            where: { id_feedback: parseInt(id_feedback) },
            data: {
                feedback,
                ativo: parseInt(ativo),
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedFeedback
        });

    } catch (error) {
        console.error('Erro ao atualizar feedback:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// Excluir feedback
export async function DELETE(request, { params }) {
    try {
        const { id_feedback } = params;

        if (!id_feedback || isNaN(parseInt(id_feedback))) {
            return NextResponse.json(
                { success: false, error: 'ID do feedback inválido' },
                { status: 400 }
            );
        }

        await prisma.feedback.delete({
            where: { id_feedback: parseInt(id_feedback) }
        });

        return NextResponse.json({
            success: true,
            message: 'Feedback excluído com sucesso'
        });

    } catch (error) {
        console.error('Erro ao excluir feedback:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}