// app/api/usuarios/admin/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '1');

        const [usuarios, total] = await prisma.$transaction([
            prisma.usuario.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
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
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Erro ao buscar usuários',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validação dos campos obrigatórios
    if (!body.nome || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const emailExistente = await prisma.usuario.findUnique({
      where: { email: body.email },
    });

    if (emailExistente) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    // Preparar dados para criação
    const novoUsuario = {
      nome: body.nome,
      email: body.email,
      tipo: parseInt(body.tipo || 2), // Default para usuário comum
      ativo: parseInt(body.ativo || null), // Default para ativo
      endereco: body.endereco || null,
      numero: body.numero || null,
      cep: body.cep || null,
      cidade: body.cidade || null,
      estado: body.estado || null,
      senha: body.senha || 'A1234567!',
      img_usuario: body.img_usuario || '/images/usuario/fotodoperfil.png'
    };

    // Criar o novo usuário
    const usuarioCriado = await prisma.usuario.create({
      data: novoUsuario,
    });

    return NextResponse.json(
      { 
        success: true, 
        data: usuarioCriado,
        message: 'Usuário criado com sucesso' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro POST:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}