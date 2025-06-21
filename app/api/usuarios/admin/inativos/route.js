// app/api/usuarios/admin/inativos/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '15');

        const [usuarios, total] = await prisma.$transaction([
            prisma.usuario.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                where: {
                    ativo: 0, // Filtrar apenas usuários inativos
                },
                orderBy: { data_cadastro: 'desc' },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    ativo: true,
                    data_cadastro: true,
                    // Removi campos sensíveis como senha que não deveriam ser retornados
                }
            }),
            prisma.usuario.count()
        ]);

        return NextResponse.json({
            success: true,
            data: usuarios,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar usuários inativos:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Erro ao buscar usuários inativos',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            }, 
            { status: 500 }
        );
    }
}
