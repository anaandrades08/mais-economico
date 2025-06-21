// app/api/admin/tipos-ingredientes/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15'); // Ou outro valor padrão
        const [tipoIngredientes, total] = await prisma.$transaction([
            prisma.tipoIngrediente.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                select: {
                    id_tipo_ingrediente: true,
                    tipo_ingrediente: true,
                }
            }),
            prisma.tipoIngrediente.count()
        ]).catch(err => {
            console.error("Transaction error:", err);
            throw err;
        });

        return NextResponse.json({
            success: true,
            data: tipoIngredientes,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar tipos de ingredientes:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar tipos de ingredientes',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}


export const POST = async (request) => {
    try {
        const formData = await request.formData();

        // Extract form data
        const tipo_ingrediente = formData.get('tipo_ingrediente');

        // Validate required fields
        if (!tipo_ingrediente) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }
        const newTipoIngrediente = await prisma.tipoIngrediente.create({
            data: {
                tipo_ingrediente: tipo_ingrediente.trim(),
            }
        });

        return NextResponse.json({
            success: true,
            data: newTipoIngrediente,
            message: 'Tipo de Ingrediente cadastrado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar tipo de ingrediente:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar tipo de ingrediente',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
