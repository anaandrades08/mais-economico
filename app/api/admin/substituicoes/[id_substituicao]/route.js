// app/api/admin/substituicoes/[id_substituicao]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Obter detalhes do substituicao
export async function GET(request, { params }) {
    try {
        const { id_substituicao } = params;

        if (!id_substituicao || isNaN(parseInt(id_substituicao))) {
            return NextResponse.json(
                { success: false, error: 'ID do substituicao inválido' },
                { status: 400 }
            );
        }

        const substituicao = await prisma.substituicao.findUnique({
            where: { id_substituicao: parseInt(id_substituicao) },
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

        if (!substituicao) {
            return NextResponse.json(
                { success: false, error: 'Substituicao não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: substituicao
        });

    } catch (error) {
        console.error('Erro ao buscar substituicao:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// Atualizar substituicao
export async function PUT(request, { params }) {
    try {
        const { id_substituicao } = params;

        if (!id_substituicao || isNaN(parseInt(id_substituicao))) {
            return NextResponse.json(
                { success: false, error: 'ID do substituicao inválido' },
                { status: 400 }
            );
        }

        const { substituicao, ativo} = await request.json();

        // Validações
        if (!substituicao || typeof substituicao !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Conteúdo do substituicao inválido' },
                { status: 400 }
            );
        }

        if (![0, 1, 2, 3].includes(parseInt(ativo))) {
            return NextResponse.json(
                { success: false, error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updatedSubstituicao = await prisma.substituicao.update({
            where: { id_substituicao: parseInt(id_substituicao) },
            data: {
                substituicao,
                ativo: parseInt(ativo),
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedSubstituicao
        });

    } catch (error) {
        console.error('Erro ao atualizar substituicao:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// Excluir substituicao
export async function DELETE(request, { params }) {
    try {
        const { id_substituicao } = params;

        if (!id_substituicao || isNaN(parseInt(id_substituicao))) {
            return NextResponse.json(
                { success: false, error: 'ID do substituicao inválido' },
                { status: 400 }
            );
        }

        await prisma.substituicao.delete({
            where: { id_substituicao: parseInt(id_substituicao) }
        });

        return NextResponse.json({
            success: true,
            message: 'Substituicao excluído com sucesso'
        });

    } catch (error) {
        console.error('Erro ao excluir substituicao:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}