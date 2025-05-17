// app/api/feedbacks/receitas/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

// Verifica os feedbacks de uma receita
export const GET = async (request, { params }) => {
    try {
        const {id_receita } = await params;
        const recipeId = parseInt(id_receita);

        // Validação dos ID
        if (isNaN(recipeId) || recipeId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido da receita' },
                { status: 400 }
            );
        }
        // Busca os feedbacks
        const feedbacks = await prisma.feedback.findFirst({
            where: {
                id_receita: recipeId,
                ativo: 1,
            },
            orderBy: {
              data_cadastro: 'desc', 
            },
            select: {
              id_feedback: true,
              id_receita: true,
              id_usuario: true,
              feedback: true,
              total_estrela: true,
              data_cadastro: true,
              usuario: {
                select: {
                  nome: true
                },
              },
            },
        });
        if (feedbacks.length === 0 || !feedbacks) {
          return NextResponse.json(
            { error: 'Feedbacks não encontrados para a receita' },
            { status: 404 }
          );
        }
      // Calcular média de avaliações
      const mediaAvaliacoes = feedbacks.length > 0
        ? feedbacks.reduce((acc, curr) => acc + curr.total_estrela, 0) / feedbacks.length
        : 0;
        return NextResponse.json({
          feedback: {
            media_avaliacoes: mediaAvaliacoes.toFixed(1),
            total_avaliacoes: feedbacks.length,
          },
          feedbacks: feedbacks.map(fb => ({
            id_feedback: fb.id_feedback,
            id_usuario: fb.id_usuario,
            feedback: fb.feedback,
            total_estrela: fb.total_estrela,
            data_cadastro: fb.data_cadastro,
            ativo: fb.ativo,
            usuario: fb.usuario.nome,
          }))
        });

    } catch (error) {
        console.error('Erro ao verificar feedbacks:', error);
        return NextResponse.json(
            { error: 'Erro interno ao verificar feedbacks' },
            { status: 500 }
        );
    }
};