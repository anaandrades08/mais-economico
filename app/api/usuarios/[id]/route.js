// app/api/usuarios/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// Função para obter o usuário pelo ID
export const GET = async (request, { params }) => {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    //verificar se é usuario valido
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      {
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
};

// Função para atualizar o usuário (dados pessoais ou senha)
export const PUT = async (request, { params }) => {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    const data = await request.json();

    // Verificar se o email já existe para outro usuário
    const usuarioComEmail = await prisma.usuario.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: parseInt(id)
        }
      }
    });

    if (usuarioComEmail) {
      return NextResponse.json(
        { error: 'Este email já está em uso por outro usuário' },
        { status: 400 }
      );
    }

    // Preparar os dados para atualização
    const updateData = {
      nome: data.nome,
      email: data.email,
      endereco: data.endereco,
      numero: data.numero,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      img_usuario: data.img_usuario
    };

    // Adicionar senha apenas se foi fornecida
    if (data.senha) {
      updateData.senha = data.senha;
    }

    // Atualizar usuário
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json(usuarioAtualizado);

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // 1. Primeiro obtemos o usuário para pegar o caminho da imagem
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        receitas: true,
        favoritos: true,
        feedbacks: true,
        dicas: true,
        substituicoes: true,
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // 2. Verificar dependências antes de excluir
    if (usuario.receitas.length > 0 || usuario.favoritos.length > 0 || usuario.feedbacks.length > 0 || usuario.dicas.length > 0 || usuario.substituicoes.length > 0) {

      if (usuario.receitas.length > 0) {

             // Deletar substituicoes de receitas
             await prisma.substituicao.deleteMany({
              where: { receita: { id_usuario: parseInt(id) } }
            });

        // Deletar modos de preparo das receitas do usuário
        await prisma.modoPreparo.deleteMany({
          where: {
            id_titulo_preparo: {
              in: await prisma.tituloPreparo.findMany({
                where: { receita: { id_usuario: parseInt(id) } },
                select: { id_titulo_preparo: true }
              }).then(titulos => titulos.map(t => t.id_titulo_preparo))
            }
          }
        });

        // Deletar títulos de preparo das receitas do usuário
        await prisma.tituloPreparo.deleteMany({
          where: { receita: { id_usuario: parseInt(id) } }
        });

        // Deletar ingredientes das receitas do usuário
        await prisma.ingredienteReceita.deleteMany({
          where: {
            id_titulo_ingrediente_receita: {
              in: await prisma.tituloIngredientesReceita.findMany({
                where: { receita: { id_usuario: parseInt(id) } },
                select: { id_titulo_ingrediente_receita: true }
              }).then(titulos => titulos.map(t => t.id_titulo_ingrediente_receita))
            }
          }
        });

        // Deletar títulos de ingredientes das receitas do usuário
        await prisma.tituloIngredientesReceita.deleteMany({
          where: { receita: { id_usuario: parseInt(id) } }
        });

        // Deletar as receitas do usuário
        await prisma.receita.deleteMany({
          where: { id_usuario: parseInt(id) }
        });

      }
      if (usuario.dicas.length > 0) {
        // Deletar dicas associadas ao usuário
        await prisma.dica.deleteMany({
          where: { id_usuario: parseInt(id) }
        });
      }
      if (usuario.substituicoes.length > 0) {
        // Deletar substituições associadas ao usuário
        await prisma.substituicao.deleteMany({
          where: { id_usuario: parseInt(id) }
        });
      }
      if (usuario.favoritos.length > 0) {
        // Deletar favoritos associados ao usuário
        await prisma.favorito.deleteMany({
          where: { id_usuario: parseInt(id) }
        });
      }
      if (usuario.feedbacks.length > 0) {
        // Deletar favoritos associados ao usuário
        await prisma.feedback.deleteMany({
          where: { id_usuario: parseInt(id) }
        });
      }
    }

    // 3. Excluir a imagem do perfil se existir
    if (usuario.img_usuario) {
      try {
        const imagePath = path.join(
          process.cwd(),
          'public',
          usuario.img_usuario
        );
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        // Não falha a operação se não conseguir excluir a imagem
      }
    }

    // 4. Excluir o usuário do banco de dados
    await prisma.usuario.delete({
      where: { id: userId }
    });

    return NextResponse.json(
      { success: true, message: 'Conta excluída com sucesso' }
    );

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      {
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
};

