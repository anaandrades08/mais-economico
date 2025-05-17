
// app/api/usuarios/usuarios-novos/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
        const usuariosNovos = await prisma.usuario.findMany({
            where: {
                ativo: null // filtrar apenas usuários novos
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

        return NextResponse.json(usuariosNovos)
    } catch (error) {
        console.error('Erro ao buscar usuários novos:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuários novos' },
            { status: 500 }
        )
    }

}


