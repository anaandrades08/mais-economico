// api/receita/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma.ts';


// Função para obter receita pelo ID da receita
export const GET = async (request, { params }) => {
  try {
    const { id_receita } = await params;
    const recipeId = parseInt(id_receita);
    //verificar se é receita valida
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    const receita = await prisma.receita.findUnique({
      where: {
        id_receita: recipeId,
      },
      include: {
        categoria: {
          select: {
            nome: true,
          }
        },
        titulosIngrediente: {
          select: {
            id_titulo_ingrediente_receita: true,
            titulo_ingrediente_receita: true,
            ingredientes: {
              select: {
                id_ingrediente_receita: true,
                quantidade: true,
                data_cadastro: true,
                ingrediente: {
                  select: {
                    id_ingrediente: true,
                    id_tipo_ingrediente: true,
                    descricao_ingrediente: true,
                  }
                },
                unidadeMedida: {
                  select: {
                    id_uni_medida: true,
                    unidade_medida: true,
                    sigla: true,
                  }
                }
              }
            }
          }
        },
        titulosPreparo: {
          select: {
            id_titulo_preparo: true,
            titulo_preparo: true,
            modosPreparo: {
              select: {
                id_preparo: true,
                descricao_preparo: true,
                data_cadastro: true,
              }
            }
          }
        },
        feedbacks:{
          select: {
            id_feedback: true,
            feedback: true,
            total_estrela: true,
            ativo: true,
            data_cadastro: true,
          },
        },
      }
    });

    if (receita.length === 0 || !receita) {
      return NextResponse.json(
        { error: 'Receita não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      receita: receita.map(rec => ({
        //dados da receita
        id_receita: rec.id_receita,
        id_categoria: rec.id_categoria,
        titulo_receita: rec.titulo_receita,
        descricao_receita: rec.descricao_receita,
        tempo_preparo: rec.tempo_preparo,
        tempo_total: rec.tempo_total,
        rendimento: rec.rendimento,
        custo: rec.custo,
        dificuldade: rec.dificuldade,
        img_receita: rec.img_receita,
        ativo: rec.ativo,
        data_cadastro: rec.data_cadastro,
        //include categoria
        titulo_categoria: rec.categoria.nome,
        //include titulo ingrediente
        titulos_ingredientes: rec.titulosIngrediente.map(ti => ({
          id_titulo_ingrediente_receita: ti.id_titulo_ingrediente_receita,
          titulo_ingrediente_receita: ti.titulo_ingrediente_receita,
          ingredientes: ti.ingredientes.map(ing => ({
            id_ingrediente_receita: ing.id_ingrediente_receita,
            quantidade: ing.quantidade,
            data_cadastro: ing.data_cadastro,
            id_ingrediente: ing.ingrediente.id_ingrediente,
            id_tipo_ingrediente: ing.ingrediente.id_tipo_ingrediente,
            descricao_ingrediente: ing.ingrediente.descricao_ingrediente,
            id_uni_medida: ing.unidadeMedida.id_uni_medida,
            unidade_medida: ing.unidadeMedida.unidade_medida,
            sigla: ing.unidadeMedida.sigla,
          })),
        })),
        //include titulo preparo
        titulos_preparo: rec.titulosPreparo.map(tp => ({
          id_titulo_preparo: tp.id_titulo_preparo,
          titulo_preparo: tp.titulo_preparo,
          modos_preparo: tp.modosPreparo.map(mp => ({
            id_preparo: mp.id_preparo,
            descricao_preparo: mp.descricao_preparo,
            data_cadastro: mp.data_cadastro,
          })),
        })),
      })),
    });

  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar receita' },
      { status: 500 }
    );
  }
}


// Rota PUT para alterar uma receita
export const PUT = async (request, { params }) => {
  try {
    const { id_receita } = await params;
    const recipeId = parseInt(id_receita);
    //verificar se é receita valida
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    const {
      titulo_receita,
      descricao_receita,
      tempo_preparo,
      tempo_total,
      rendimento,
      custo,
      dificuldade,
      img_receita,
      id_categoria,
      titulosIngrediente,
      titulosPreparo
    } = await req.json(); // Obtém os dados da requisição

    // Verifica se a receita existe
    const receitaExistente = await prisma.receita.findUnique({
      where: { id_receita: recipeId },
    });

    if (!receitaExistente) {
      return NextResponse.json({ error: 'Receita não encontrada' }, { status: 404 });
    }

    // Inicia a transação para garantir que a alteração seja atômica
    const receitaAtualizada = await prisma.$transaction(async (prisma) => {
      // Atualiza os dados da receita
      const updatedReceita = await prisma.receita.update({
        where: { id_receita: recipeId },
        data: {
          titulo_receita,
          descricao_receita,
          tempo_preparo,
          tempo_total,
          rendimento,
          custo,
          dificuldade,
          img_receita,
          id_categoria
        }
      });

      // Atualiza os ingredientes, se existirem alterações
      if (titulosIngrediente) {
        for (const tituloIngrediente of titulosIngrediente) {
          await prisma.tituloIngrediente.update({
            where: { id_titulo: tituloIngrediente.id_titulo },
            data: {
              titulo_ingrediente_receita: tituloIngrediente.titulo_ingrediente_receita
            }
          });

          // Aqui você pode também atualizar os ingredientes associados a cada título de ingrediente
          if (tituloIngrediente.ingredientes) {
            for (const ingrediente of tituloIngrediente.ingredientes) {
              await prisma.ingrediente.update({
                where: { id_ingrediente: ingrediente.id_ingrediente },
                data: {
                  descricao_ingrediente: ingrediente.descricao_ingrediente,
                  valor: ingrediente.valor,
                  quantidade: ingrediente.quantidade,
                  id_unidade_medida: ingrediente.unidadeMedida.id_unidade_medida
                }
              });
            }
          }
        }
      }

      // Atualiza os modos de preparo, se existirem alterações
      if (titulosPreparo) {
        for (const tituloPreparo of titulosPreparo) {
          await prisma.tituloPreparo.update({
            where: { id_titulo: tituloPreparo.id_titulo },
            data: {
              titulo_preparo: tituloPreparo.titulo_preparo
            }
          });

          // Aqui você pode também atualizar os modos de preparo associados a cada título de preparo
          if (tituloPreparo.modosPreparo) {
            for (const modoPreparo of tituloPreparo.modosPreparo) {
              await prisma.modoPreparo.update({
                where: { id_modo_preparo: modoPreparo.id_modo_preparo },
                data: {
                  descricao_preparo: modoPreparo.descricao_preparo
                }
              });
            }
          }
        }
      }

      return updatedReceita;
    });

    return NextResponse.json({ message: 'Receita atualizada com sucesso', receita: receitaAtualizada });
  } catch (error) {
    console.error('Erro ao atualizar a receita:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a receita' }, { status: 500 });
  }
};



// Rota DELETE para excluir uma receita e suas dependências

export const DELETE = async (request, { params }) => {
  try {
    const { id_receita } = await params;
    const recipeId = parseInt(id_receita);
    //verificar se é receita valida
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    // Iniciando uma transação
    const result = await prisma.$transaction(async (prisma) => {
      // Remover todas as substituições associadas à receita
      await prisma.substituicao.deleteMany({
        where: { id_receita: recipeId },
      });

      // Remover todos os favoritos associados à receita
      await prisma.favorito.deleteMany({
        where: { id_receita: recipeId },
      });

      // Remover todos os feedbacks associados à receita
      await prisma.feedback.deleteMany({
        where: { id_receita: recipeId },
      });

      // Remover todos os modos de preparo associados à receita
     await prisma.modoPreparo.deleteMany({
      where: {
        id_titulo_preparo: {
          in: await prisma.tituloPreparo.findMany({
            where: { receita: { id_receita: recipeId } },
            select: { id_titulo_preparo: true }
          }).then(titulos => titulos.map(t => t.id_titulo_preparo))
        }
      }
    });

    // Deletar títulos de preparo da receita
    await prisma.tituloPreparo.deleteMany({
      where: { receita: { id_receita: recipeId } }
    });

    // Deletar ingredientes da receita
    await prisma.ingredienteReceita.deleteMany({
      where: {
        id_titulo_ingrediente_receita: {
          in: await prisma.tituloIngredientesReceita.findMany({
            where: { receita: { id_receita: recipeId } },
            select: { id_titulo_ingrediente_receita: true }
          }).then(titulos => titulos.map(t => t.id_titulo_ingrediente_receita))
        }
      }
    });

    // Deletar títulos de ingredientes dasa receitaa
    await prisma.tituloIngredientesReceita.deleteMany({
      where: { receita: { id_receita: recipeId } }
    });

      // Remover todos os ingredientes associados à receita
      await prisma.ingredienteReceita.deleteMany({
        where: { id_receita: recipeId },
      });

      // Remover a receita
      await prisma.receita.delete({
        where: { id_receita: recipeId },
      });
    });

    return NextResponse.json({ message: 'Receita e suas dependências foram excluídas com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir a receita:', error);
    return NextResponse.json({ error: 'Erro ao excluir a receita' }, { status: 500 });
  }
};