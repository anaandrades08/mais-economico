// app/api/auth/verify-password/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/lib/authOptions';
import { prisma } from '@app/lib/prisma';
import bcrypt from 'bcryptjs';

export const POST = async (request) => {
    try {
        // Obter a sessão do usuário
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Não autorizado - Sessão não encontrada' },
                { status: 401 }
            );
        }

        const { password } = await request.json();
        
        if (!password) {
            return NextResponse.json(
                { error: 'Senha não fornecida' },
                { status: 400 }
            );
        }

        // Buscar usuário no banco de dados
        const user = await prisma.usuario.findUnique({
            where: { id: parseInt(session.user.id) },
            select: { senha: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        if (!user.senha) {
            return NextResponse.json(
                { 
                    valid: false,
                    error: 'Usuário não possui senha cadastrada'
                },
                { status: 400 }
            );
        }

        //const isMatch = await bcrypt.compare(password, user.senha);
        const isMatch = password === user.senha;
        
        if (!isMatch) {
            return NextResponse.json(
                { 
                    valid: false,
                    error: 'Senha incorreta'
                },
                { status: 401 }
            );
        }

        return NextResponse.json({ valid: true });

    } catch (error) {
        console.error('Erro na verificação de senha:', error);
        return NextResponse.json(
            { 
                error: 'Erro interno no servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
};