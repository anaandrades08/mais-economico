// app/api/admin/receitas/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';
import { BsActivity } from 'react-icons/bs';

export async function GET(request, { params }) {
    const { id_receita } = params;

    try {
        const receita = await prisma.receita.findUnique({
            where: { id_receita: parseInt(id_receita) },
            select: {
                id_receita: true,
                titulo_receita: true,
                descricao_receita: true,
                tempo_preparo: true,
                tempo_total: true,
                rendimento: true,
                custo: true,
                dificuldade: true,
                img_receita: true,
                data_cadastro: true,
                ativo: true,
                usuario: { select: { id: true, nome: true, email: true } },
                categoria: { select: { id_categoria: true, nome: true } },
                titulosIngrediente: {
                    select: {
                        id_titulo_ingrediente_receita: true,
                        titulo_ingrediente_receita: true,   
                        ingredientes:true,                     
                    }
                },
                titulosPreparo: {
                    select: {
                        id_titulo_preparo: true,
                        titulo_preparo: true,
                        modosPreparo: true,
                    }
                },
                substituicoes: {
                    select: {
                        id_substituicao: true,
                        descricao_preparo: true,                        
                        quantidade: true,
                        id_uni_medida: true,
                        data_cadastro: true,
                        ativo: true,
                        usuario: { select: { id: true, nome: true } }
                    }
                },
                feedbacks: {
                    select: {
                        id_feedback: true,
                        feedback: true,
                        total_estrela: true,
                        data_cadastro: true,
                        ativo: true,
                        usuario: { select: { id: true, nome: true } }
                    }
                },
                _count: {
                    select: {
                        titulosIngrediente: true,
                        titulosPreparo: true,
                        substituicoes: true,
                        favoritos: true,
                        feedbacks: true
                    }
                }
            }
        });

        if (!receita) {
            return NextResponse.json(
                { success: false, error: 'Receita não encontrada' },
                { status: 404 }
            );
        }

        const { _count, ...rest } = receita;

        return NextResponse.json({
            success: true,
            data: {
                ...rest,
                total_titulosIngrediente: _count.titulosIngrediente,
                total_titulosPreparo: _count.titulosPreparo,
                total_substituicoes: _count.substituicoes,
                total_favoritos: _count.favoritos,
                total_feedbacks: _count.feedbacks
            }
        });

    } catch (error) {
        console.error('Erro ao buscar receita:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar receita' },
            { status: 500 }
        );
    }
}