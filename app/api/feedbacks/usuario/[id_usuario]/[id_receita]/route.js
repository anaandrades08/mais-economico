// app/api/feedbacks/usuario/[id_usuario]/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Verifica o feedback de uma receita
export const GET = async (request, { params }) => {
    try {
        const {id_usuario, id_receita } = await params;
        const userId = parseInt(id_usuario);
        const recipeId = parseInt(id_receita);

        // Validação dos IDs
        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido do usuário' },
                { status: 400 }
            );
        }
        if (isNaN(recipeId) || recipeId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido da receita' },
                { status: 400 }
            );
        }

        // Busca o favorito
        const feedback = await prisma.feedback.findFirst({
            where: {
                id_usuario: userId,
                id_receita: recipeId
            }
        });

        return NextResponse.json({feedback});

    } catch (error) {
        console.error('Erro ao verificar feedback:', error);
        return NextResponse.json(
            { error: 'Erro interno ao verificar feedback' },
            { status: 500 }
        );
    }
};