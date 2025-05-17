// app/api/favoritos/usuario/[id_usuario]/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Verifica se uma receita específica está nos favoritos do usuário
export const GET = async (request, { params }) => {
    try {
        const {id_usuario, id_receita } = await params;
        const userId = parseInt(id_usuario);
        const recipeId = parseInt(id_receita);

        // Validação dos IDs
        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido do usuário' },
                { status: 400 }
            );
        }
        if (isNaN(recipeId) || recipeId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido da receita' },
                { status: 400 }
            );
        }

        // Busca o favorito
        const favorito = await prisma.favorito.findFirst({
            where: {
                id_usuario: userId,
                id_receita: recipeId
            }
        });

        return NextResponse.json({ isFavorito: !!favorito });

    } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        return NextResponse.json(
            { error: 'Erro interno ao verificar favorito' },
            { status: 500 }
        );
    }
};

//POST favorito por usuario e receita
export const POST = async (request, { params }) => {
    try {
        const {id_usuario, id_receita } = await params;
        const userId = parseInt(id_usuario);
        const recipeId = parseInt(id_receita);

        // Validação dos IDs
        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido do usuário' },
                { status: 400 }
            );
        }
        if (isNaN(recipeId) || recipeId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido da receita' },
                { status: 400 }
            );
        }

        // Verifica se já existe
        const favoritoExistente = await prisma.favorito.findFirst({
            where: {
                id_usuario: userId,
                id_receita: recipeId
            }
        });

        if (favoritoExistente) {
            return NextResponse.json(
                { error: 'Receita já está nos favoritos' },
                { status: 409 }
            );
        }

        // Cria novo favorito
        const novoFavorito = await prisma.favorito.create({
            data: {
                id_usuario: userId,
                id_receita: recipeId
            },
            include: {
                receita: true
            }
        });

        return NextResponse.json(novoFavorito);

    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        return NextResponse.json(
            { error: 'Erro interno ao adicionar favorito' },
            { status: 500 }
        );
    }
};


//DELETE favorito por usuario e receita

export const DELETE = async (request, { params }) => {
    try {
        const {id_usuario, id_receita } = await params;
        const userId = parseInt(id_usuario);
        const recipeId = parseInt(id_receita);
        // Validação dos IDs
        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido do usuário' },
                { status: 400 }
            );
        }
        if (isNaN(recipeId) || recipeId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido da receita' },
                { status: 400 }
            );
        }

        // Verifica se existe
        const favoritoExistente = await prisma.favorito.findFirst({
            where: {
                id_usuario: userId,
                id_receita: recipeId
            }
        });

        if (!favoritoExistente) {
            return NextResponse.json(
                { error: 'Favorito não encontrado' },
                { status: 404 }
            );
        }

        // Remove o favorito
        await prisma.favorito.deleteMany({
            where: {
                id_usuario: userId,
                id_receita: recipeId
            }
        });

        return NextResponse.json(
            { success: true, message: 'Favorito removido com sucesso' }
        );

    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        return NextResponse.json(
            { error: 'Erro interno ao remover favorito' },
            { status: 500 }
        );
    }
};