// app/api/usuarios/login/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';


/// POST  para validar login por email e senha
export const POST = async (request) => {
    try {
      const data = await request.json();
      const { email, senha } = data;
  
      if (!email || !senha) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
      }
  
      const usuario = await prisma.usuario.findFirst({
        where: {
          email: email,
          senha: senha,
        },
        select: {
          ativo: true,
        }
      });
  
      if (!usuario) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário para login:', error);
      return NextResponse.json({ error: 'Erro ao buscar usuário para login' }, { status: 500 });
    }
  };