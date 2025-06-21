// app/api/admin/categorias/route.js
import { NextResponse } from 'next/server';
import {prisma} from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15'); // Ou outro valor padrão

        const [categorias, total] = await prisma.$transaction([
            prisma.categoria.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                select: {
                    id_categoria: true,
                    nome: true,
                    link_categoria: true,                
                }
            }),
            prisma.categoria.count()
        ]).catch(err => {
            console.error("Transaction error:", err);
            throw err;
        });

        return NextResponse.json({
            success: true,
            data: categorias,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar categorias',
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
        const nome = formData.get('nome');
        const link_categoria = formData.get('link_categoria');

        // Validate required fields
        if (!nome || !link_categoria) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }
        const newCategoria = await prisma.categoria.create({
            data: {
                nome,
                link_categoria,
            }
        });

        return NextResponse.json({
            success: true,
            data: newCategoria,
            message: 'Categoria cadastrada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar categoria:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar categoria',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
