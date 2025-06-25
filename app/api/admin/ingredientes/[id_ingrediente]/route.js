// app/api/admin/ingredientes/[id_ingrediente]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
    const { id_ingrediente } = params;

    try {
        const ingrediente = await prisma.ingrediente.findUnique({
            where: { id_ingrediente: parseInt(id_ingrediente) },
            select: {
                id_ingrediente: true,
                descricao_ingrediente: true,
                id_tipo_ingrediente: true,
                quantidade: true,
                valor: true,
                id_uni_medida: true,
                tipoIngrediente: {
                    select: {
                        tipo_ingrediente: true
                    }
                },
                unidadeMedida: {
                    select: {
                        unidade_medida: true,
                        sigla: true
                    }
                },
                _count: {
                    select: {
                        ingredientesReceita: true // Conta quantos ingredientes estão vinculados
                    }
                }
            }
        });

        if (!ingrediente) {
            return NextResponse.json(
                { success: false, error: 'Ingrediente não encontrado' },
                { status: 404 }
            );
        }

        // Reestrutura os dados para incluir a contagem de forma mais clara
        const responseData = {
            ...ingrediente,
            total_ingredientesReceita: ingrediente._count.ingredientesReceita
        };
        delete responseData._count; // Remove o objeto _count que não é mais necessário

        return NextResponse.json({ success: true, data: responseData });
    } catch (error) {
        console.error('Erro ao buscar ingrediente:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar ingrediente' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id_ingrediente } = params;

    try {
        const formData = await request.formData();
        const descricao_ingrediente = formData.get('descricao_ingrediente')?.toString().trim();
        const id_tipo_ingrediente = formData.get('id_tipo_ingrediente');
        const valor = formData.get('valor');
        const id_uni_medida = formData.get('id_uni_medida');
        const quantidade = formData.get('quantidade');


        // Validate required fields
        const missingFields = [];
        if (!descricao_ingrediente) missingFields.push('descricao_ingrediente');
        if (!id_tipo_ingrediente) missingFields.push('id_tipo_ingrediente');
        if (!valor) missingFields.push('valor');
        if (!id_uni_medida) missingFields.push('id_uni_medida');
        if (!quantidade) missingFields.push('quantidade');

        if (isNaN(Number(valor)) || isNaN(Number(quantidade))) {
            return NextResponse.json(
                { success: false, error: 'Valor e quantidade devem ser números' },
                { status: 400 }
            );
        }

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Todos os campos são obrigatórios',
                    missingFields: missingFields // Opcional: informar quais campos faltam
                },
                { status: 400 }
            );
        }

        const updatedIngrediente = await prisma.ingrediente.update({
            where: { id_ingrediente: parseInt(id_ingrediente) },
            data: {
                descricao_ingrediente: descricao_ingrediente,
                id_tipo_ingrediente: parseInt(id_tipo_ingrediente),
                valor: parseFloat(valor),
                quantidade: parseFloat(quantidade),
                id_uni_medida: parseInt(id_uni_medida),
            }
        });

        return NextResponse.json({ success: true, data: updatedIngrediente });
    } catch (error) {
        console.error('Erro ao atualizar ingrediente:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao atualizar ingrediente' },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    const { id_ingrediente } = params;

    try {
        const deletedIngrediente = await prisma.ingrediente.delete({
            where: { id_ingrediente: parseInt(id_ingrediente) }
        });

        return NextResponse.json({
            success: true,
            data: deletedIngrediente,
            message: 'Ingrediente excluído com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao excluir ingrediente:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir ingrediente' },
            { status: 500 }
        );
    }
}
