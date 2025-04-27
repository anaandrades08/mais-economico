// app/api/usuarios/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
      const usuarios = await prisma.usuario.findMany()
      return NextResponse.json(usuarios)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
    }
  }