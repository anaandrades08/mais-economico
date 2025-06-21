// app/api/admin/feedbacks/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '1');

        const [feedbacks, total] = await prisma.$transaction([
            prisma.feedback.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { data_cadastro: 'desc' },
                select: {
                    id_feedback: true,
                    feedback: true,
                    total_estrela: true,
                    ativo: true,
                    data_cadastro: true,
                    id_receita: true,
                    id_usuario: true,
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
                }
            }),
            prisma.feedback.count()
        ]);

        return NextResponse.json({
            success: true,
            data: feedbacks,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar feedbacks',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}


export const POST = async (request) => {
    try {
        const formData = await request.formData();
        const feedback = formData.get('feedback');
        const total_estrela = parseInt(formData.get('total_estrela'));
        const ativo = parseInt(formData.get('ativo'));
        const id_receita = parseInt(formData.get('id_receita'));
        const id_usuario = parseInt(formData.get('id_usuario'));

        if (!feedback || !total_estrela || !id_usuario || !id_receita) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }
        const newFeedback = await prisma.feedback.create({
            data: {
                feedback,
                total_estrela,
                ativo,
                id_receita,
                id_usuario,
                data_cadastro: new Date(),
            }
        });

        return NextResponse.json({
            success: true,
            data: newFeedback,
            message: 'Feedback cadastrado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar feedback:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar feedback',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
