// app/api/admin/ingredientes/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15'); // Ou outro valor padrão
        const [ingredientes, total] = await prisma.$transaction([
            prisma.ingrediente.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: {
                    id_tipo_ingrediente: 'asc', // Ordena por descrição do ingrediente
                },
                select: {
                    id_ingrediente: true,
                    id_tipo_ingrediente: true,
                    descricao_ingrediente: true,
                    valor: true,
                    quantidade: true,
                    id_uni_medida: true,
                    tipoIngrediente: {
                        select: {
                            tipo_ingrediente: true,
                        }
                    },
                    unidadeMedida: {
                        select: {
                            sigla: true,
                        }
                    },
                }
            }),
            prisma.ingrediente.count()
        ]).catch(err => {
            console.error("Transaction error:", err);
            throw err;
        });
        
        const totalIngredientes = await prisma.ingrediente.count();

        return NextResponse.json({
            success: true,
            data: ingredientes,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar ingredientes:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar ingredientes',
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
        const id_tipo_ingrediente = formData.get('id_tipo_ingrediente');
        const descricao_ingrediente = formData.get('descricao_ingrediente');
        const valor = formData.get('valor');
        const quantidade = formData.get('quantidade');
        const id_uni_medida = formData.get('id_uni_medida');

        // Validate required fields
        if (!id_tipo_ingrediente || !descricao_ingrediente || !valor || !quantidade || !id_uni_medida) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }
        const newIngrediente = await prisma.ingrediente.create({
            data: {
                id_tipo_ingrediente: parseInt(id_tipo_ingrediente),
                descricao_ingrediente: descricao_ingrediente.trim(),
                valor: parseFloat(valor),
                quantidade: parseFloat(quantidade),
                id_uni_medida: parseInt(id_uni_medida),
            }
        });

        return NextResponse.json({
            success: true,
            data: newIngrediente,
            message: 'Ingrediente cadastrado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar ingrediente:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar ingrediente',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
