// app/api/usuarios/cadastro/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Função para criar um novo usuário la no cadastro do site
export const POST = async (req) => {
    const body = await req.json();
    try {
      const novoUser = await prisma.usuario.create({
        data: {
          nome: body.nome,
          email: body.email,
          senha: body.senha,
          telefone: body.telefone,
          endereco: body.endereco,
          numero: body.numero,
          cidade: body.cidade,
          estado: body.estado,
          cep: body.cep,
          img_usuario: body.img_usuario,
          ativo: null,
          tipo: 2,
        },
      });
      return NextResponse.json(novoUser, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
    }
  };
  
