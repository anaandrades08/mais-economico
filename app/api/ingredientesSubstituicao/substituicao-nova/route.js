// app/api/ingredientesSubstituicao/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// GET - Exibir todas as substituições de ingredientes
export async function GET() {
    try {
        const substituicoes = await prisma.substituicao.findMany({
            where: { ativo: null },
            orderBy: {
                data_cadastro: 'desc' //ordenar por data de cadastro descrescente
            },
            select: {
                id_substituicao: true,
                id_receita: true,
                id_ingrediente: true,
                id_usuario: true,
                descricao_preparo: true,
                quantidade: true,
                id_uni_medida: true,
                ativo: true,
                data_cadastro: true,
                receita: {
                    select: {
                        titulo_receita: true
                    }
                },
                ingrediente: {
                    select: {
                        descricao_ingrediente: true
                    }
                },
                usuario: {
                    select: {
                        nome: true,
                        email: true
                    }
                },
                unidadeMedida: {
                    select: {
                        unidade_medida: true,
                        sigla: true
                    }
                }
            }
        });

        return NextResponse.json(substituicoes);
    } catch (error) {
        console.error('Erro ao buscar substituições de ingredientes:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar substituições de ingredientes' },
            { status: 500 }
        );
    }
}

