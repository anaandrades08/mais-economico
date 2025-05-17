// app/api/usuarios/usuarios-inativos/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
        const usuariosInativos = await prisma.usuario.findMany({
            where: {
                ativo: 0 // filtrar apenas usuários inativos
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

        return NextResponse.json(usuariosInativos)
    } catch (error) {
        console.error('Erro ao buscar usuários inativos:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuários inativos' },
            { status: 500 }
        )
    }

}


