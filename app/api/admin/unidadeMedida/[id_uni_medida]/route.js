// app/api/admin/unidadeMedida/[id_uni_medida]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
    const { id_uni_medida } = params;

    try {
        const unidadeMedida = await prisma.unidadeMedida.findUnique({
            where: { id_uni_medida: parseInt(id_uni_medida) },
            select: {
                id_uni_medida: true,
                unidade_medida: true,
                sigla: true,
                _count: {
                    select: {
                        ingredientes: true // Conta quantos ingredientes de receitas estão vinculados
                    }
                },
                 _count: {
                    select: {
                        ingrediente: true // Conta quantos ingredientes estão vinculados
                    }
                },
                _count: {
                    select: {
                        substituicoes: true // Conta quantas substituições estão vinculadas
                    }
                }
            }
        });

        if (!unidadeMedida) {
            return NextResponse.json(
                { success: false, error: 'Unidade de medida não encontrada' },
                { status: 404 }
            );
        }

        // Reestrutura os dados para incluir a contagem de forma mais clara
        const responseData = {
            ...unidadeMedida,
            total_ingredientesReceita: unidadeMedida._count.ingredientes,
            total_ingredientes: unidadeMedida._count.ingrediente,
            total_substituicoes: unidadeMedida._count.substituicoes
        };
        delete responseData._count; // Remove o objeto _count que não é mais necessário

        return NextResponse.json({ success: true, data: responseData });
    } catch (error) {
        console.error('Erro ao buscar unidade de medida:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar unidade de medida' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id_uni_medida } = params;

    try {
        const formData = await request.formData();
        const unidade_medida = formData.get('unidade_medida');
        const sigla= formData.get('sigla');

        // Validate required fields
        if (!unidade_medida || !sigla) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        const updatedUnidadeMedida = await prisma.unidadeMedida.update({
            where: { id_uni_medida: parseInt(id_uni_medida) },
            data: { unidade_medida, sigla },
        });

        return NextResponse.json({ success: true, data: updatedUnidadeMedida });
    } catch (error) {
        console.error('Erro ao atualizar unidade de medida:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao atualizar unidade de medida' },
            { status: 500 }
        );
    }
} 


export async function DELETE (request, { params }) {
    const { id_uni_medida } = params;

    try {
        const deletedUnidadeMedida = await prisma.unidadeMedida.delete({
            where: { id_uni_medida: parseInt(id_uni_medida) }
        });

        return NextResponse.json({
            success: true,
            data: deletedUnidadeMedida,
            message: 'Unidade de medida excluída com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao excluir unidade de medida:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir unidade de medida' },
            { status: 500 }
        );
    }
}
