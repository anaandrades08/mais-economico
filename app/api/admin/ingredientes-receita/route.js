// app/api/admin/ingredientes-receita/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15'); // Ou outro valor padrão

        const [ingredientesReceita, total] = await prisma.$transaction([
            prisma.ingredienteReceita.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: {
                    id_ingrediente: 'asc', // Ordena por ID do ingrediente
                },
                select: {
                    id_ingrediente_receita: true,
                    id_ingrediente: true,
                    quantidade: true,
                    unidadeMedida: {
                        select: {
                            sigla: true,
                        }
                    },
                    ingrediente: {
                        select: {
                            descricao_ingrediente: true,
                        }
                    }
                }
            }),
            prisma.ingredienteReceita.count()
        ]).catch(err => {
            console.error("Transaction error:", err);
            throw err;
        });

        return NextResponse.json({
            success: true,
            data: ingredientesReceita,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar ingredientes da receita:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar ingredientes da receita',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}