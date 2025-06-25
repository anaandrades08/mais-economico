//app/api/admin/ingredientes-receita/receita/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

//exibir ingredientes de uma receita específica
export async function GET(request, { params }) {
    try {
        const { id_receita } = params;

        if (!id_receita || isNaN(parseInt(id_receita))) {
            return NextResponse.json(
                { success: false, error: 'ID da receita inválido' },
                { status: 400 }
            );
        }

        const tituloIngredientesReceita = await prisma.tituloIngredientesReceita.findUnique({
            where: { id_receita: parseInt(id_receita) },
            include: {
                ingredientes: true,
            }
        });

        if (!tituloIngredientesReceita) {
            return NextResponse.json(
                { success: false, error: 'Ingredientes não encontrados' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: tituloIngredientesReceita
        });

    } catch (error) {
        console.error('Erro ao buscar ingredientes:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
