// app/api/admin/substituicoes/route.js
import { NextResponse } from 'next/server';
import {prisma} from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15'); // Ou outro valor padrão

        const [substituicoes, total] = await prisma.$transaction([
            prisma.substituicao.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { data_cadastro: 'desc' },
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
                    usuario: {
                        select: {
                            nome: true
                        }
                    },
                    ingrediente: {
                        select: {
                            descricao_ingrediente: true,
                        }
                    },    
                    unidadeMedida: {
                        select: {
                            sigla: true,
                        }
                    },    
                }
            }),
            prisma.substituicao.count()
        ]).catch(err => {
            console.error("Transaction error:", err);
            throw err;
        });

        return NextResponse.json({
            success: true,
            data: substituicoes,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar substituições:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar substituições',
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
        const descricao_preparo = formData.get('descricao_preparo');
        const id_uni_medida = formData.get('id_uni_medida');
        const quantidade = formData.get('quantidade');

        // Validate required fields
        if (!descricao_preparo || !id_uni_medida || !quantidade) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }
        const newSubstituicao = await prisma.substituicao.create({
            data: {
                descricao_preparo,
                id_uni_medida: parseInt(id_uni_medida),
                quantidade: parseFloat(quantidade),
                ativo: null, 
                id_usuario: parseInt(formData.get('id_usuario')),
                id_receita: parseInt(formData.get('id_receita')),
                id_ingrediente: parseInt(formData.get('id_ingrediente'))
            },
        });

        return NextResponse.json({
            success: true,
            data: newSubstituicao,
            message: 'Substituição cadastrada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar substituição:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar substituição',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
