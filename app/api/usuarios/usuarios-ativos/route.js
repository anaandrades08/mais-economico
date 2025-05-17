// app/api/usuarios/usuarios-ativos/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
        const usuariosAtivos = await prisma.usuario.findMany({
            where: {
                ativo: 1 // filtrar apenas usuários ativos
            },
            orderBy: {
                data_cadastro: 'desc' //ordenar por data de cadastro descrescente
            },
            select: {
                id: true,
                nome: true,
                email: true,
                senha: true,
                telefone: true,
                endereco: true,
                numero: true,
                cidade: true,
                estado: true,
                cep: true,
                img_usuario: true,
                data_cadastro: true,
                tipo: true
            }
        })

        return NextResponse.json(usuariosAtivos)
    } catch (error) {
        console.error('Erro ao buscar usuários ativos:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuários ativos' },
            { status: 500 }
        )
    }

}


