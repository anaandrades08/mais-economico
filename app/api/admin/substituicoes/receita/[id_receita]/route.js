// app/api/admin/substituicoes/receita/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id_receita } = params;

        const substituicoes = await prisma.substituicao.findMany({
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
            data: substituicoes
        });

    } catch (error) {
        console.error('Erro ao buscar substituicoes:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}