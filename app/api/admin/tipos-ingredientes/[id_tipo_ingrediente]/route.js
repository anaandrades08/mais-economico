// app/api/admin/tipos-ingredientes/[id_tipo_ingrediente]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
    const { id_tipo_ingrediente } = params;

    try {
        const tipoIngrediente = await prisma.tipoIngrediente.findUnique({
            where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
            select: {
                id_tipo_ingrediente: true,
                tipo_ingrediente: true,
                _count: {
                    select: {
                        ingredientes: true // Conta quantos ingredientes estão vinculados
                    }
                }
            }
        });

        if (!tipoIngrediente) {
            return NextResponse.json(
                { success: false, error: 'Tipo de ingrediente não encontrado' },
                { status: 404 }
            );
        }

        // Reestrutura os dados para incluir a contagem de forma mais clara
        const responseData = {
            ...tipoIngrediente,
            total_ingredientes: tipoIngrediente._count.ingredientes
        };
        delete responseData._count; // Remove o objeto _count que não é mais necessário

        return NextResponse.json({ success: true, data: responseData });
    } catch (error) {
        console.error('Erro ao buscar tipo de ingrediente:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar tipo de ingrediente' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id_tipo_ingrediente } = params;

    try {
        const formData = await request.formData();
        const tipo_ingrediente = formData.get('tipo_ingrediente');

        // Validate required fields
        if (!tipo_ingrediente) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        const updatedTipoIngrediente = await prisma.tipoIngrediente.update({
            where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) },
            data: { tipo_ingrediente }
        });

        return NextResponse.json({ success: true, data: updatedTipoIngrediente });
    } catch (error) {
        console.error('Erro ao atualizar tipo de ingrediente:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao atualizar tipo de ingrediente' },
            { status: 500 }
        );
    }
} 


export async function DELETE (request, { params }) {
    const { id_tipo_ingrediente } = params;

    try {
        const deletedTipoIngrediente = await prisma.tipoIngrediente.delete({
            where: { id_tipo_ingrediente: parseInt(id_tipo_ingrediente) }
        });

        return NextResponse.json({
            success: true,
            data: deletedTipoIngrediente,
            message: 'Tipo de ingrediente excluído com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao excluir tipo de ingrediente:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir tipo de ingrediente' },
            { status: 500 }
        );
    }
}
