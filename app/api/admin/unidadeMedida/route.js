// app/api/admin/unidadeMedida/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15'); // Ou outro valor padrão
        const [unidadesMedida, total] = await prisma.$transaction([
            prisma.unidadeMedida.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                select: {
                    id_uni_medida: true,
                    unidade_medida: true,
                    sigla: true,
                }
            }),
            prisma.unidadeMedida.count()
        ]).catch(err => {
            console.error("Transaction error:", err);
            throw err;
        });

        return NextResponse.json({
            success: true,
            data: unidadesMedida,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar unidades de medida:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar unidades de medida',
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
        const unidade_medida = formData.get('unidade_medida');
        const sigla = formData.get('sigla');

        // Validate required fields
        if (!unidade_medida || !sigla) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }
        const newUnidadeMedida = await prisma.unidadeMedida.create({
            data: {
                unidade_medida: unidade_medida.trim(),
                sigla: sigla.trim(),
            }
        });

        return NextResponse.json({
            success: true,
            data: newUnidadeMedida,
            message: 'Unidade de medida cadastrado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar unidade de medida:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar unidade de medida',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
