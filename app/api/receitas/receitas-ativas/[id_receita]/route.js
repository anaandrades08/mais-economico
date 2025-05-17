// api/receitas/receitas-ativas/[id_receita]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma.ts';


// Função para obter receita ativa pelo ID da receita

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
        ativo: 1,
      },
      include: {
        categoria: {
          select: {
            nome: true,
          }
        },
        usuario: {
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
                id_ingrediente: true,
                id_uni_medida: true,
                quantidade: true,
                data_cadastro: true,
                ingrediente: {
                  select: {
                    id_tipo_ingrediente: true,
                    descricao_ingrediente: true,
                    valor: true,                    
                    quantidade: true,
                    id_uni_medida: true,
                  }
                },
                unidadeMedida: {
                  select: {
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
        feedbacks: {
          select: {
            id_feedback: true,
            id_usuario: true,
            feedback: true,
            total_estrela: true,
            ativo: true,
            data_cadastro: true,
            usuario: {
              select: {
                nome: true,
              }
            },
          },
        },
        substituicoes: {
          select: {
            id_substituicao: true,
            id_ingrediente: true,            
            id_uni_medida: true,            
            id_usuario: true,
            descricao_preparo: true,
            quantidade: true,
            ativo: true,
            data_cadastro: true,
            usuario: {
              select: {
                nome: true,
              }
            },
            ingrediente: {
              select: {
                id_tipo_ingrediente: true,
                descricao_ingrediente: true,
                id_uni_medida: true, 
              }
            },
            unidadeMedida: {
              select: {
                unidade_medida: true,
                sigla: true,
              }
            },
          }
        },
        favoritos: {
          select: {
            id_favorito: true,
            id_usuario: true,            
            data_cadastro: true,
          },
        },
      }
    });

    if (receita.length === 0 || !receita) {
      return NextResponse.json(
        { error: 'Receita não encontrada ou inativa' },
        { status: 404 }
      );
    }

    // Calcular média de avaliações
    const mediaAvaliacoes = receita.feedbacks.length > 0
      ? receita.feedbacks.reduce((acc, curr) => acc + curr.total_estrela, 0) / receita.feedbacks.length
      : 0;

    return NextResponse.json({
      receita: {
        // Dados básicos da receita
        id_receita: receita.id_receita,
        id_categoria: receita.id_categoria,
        titulo_receita: receita.titulo_receita,
        descricao_receita: receita.descricao_receita,
        tempo_preparo: receita.tempo_preparo,
        tempo_total: receita.tempo_total,
        rendimento: receita.rendimento,
        custo: receita.custo,
        dificuldade: receita.dificuldade,
        img_receita: receita.img_receita,
        ativo: receita.ativo,
        data_cadastro: receita.data_cadastro,

        // Informações relacionadas
        titulo_categoria: receita.categoria.nome,
        usuario: receita.usuario.nome,

        // Média de avaliações
        media_avaliacoes: mediaAvaliacoes.toFixed(1),
        total_avaliacoes: receita.feedbacks.length,

        // Estrutura de ingredientes
        titulos_ingredientes: receita.titulosIngrediente.map(ti => ({
          id_titulo_ingrediente_receita: ti.id_titulo_ingrediente_receita,
          titulo_ingrediente_receita: ti.titulo_ingrediente_receita,
          ingredientes: ti.ingredientes.map(ing => ({
            id_ingrediente_receita: ing.id_ingrediente_receita,            
            id_uni_medida: ing.id_uni_medida,
            quantidade: ing.quantidade,
            data_cadastro: ing.data_cadastro,
            id_ingrediente: ing.id_ingrediente,
            id_tipo_ingrediente: ing.ingrediente.id_tipo_ingrediente,
            descricao_ingrediente: ing.ingrediente.descricao_ingrediente,
            valor: ing.ingrediente.valor,
            qtdeTotal: ing.ingrediente.quantidade,
            iduniTotal: ing.ingrediente.id_uni_medida,
            unidade_medida: ing.unidadeMedida.unidade_medida,
            sigla: ing.unidadeMedida.sigla,
          })),
        })),

        // Modo de preparo
        titulos_preparo: receita.titulosPreparo.map(tp => ({
          id_titulo_preparo: tp.id_titulo_preparo,
          titulo_preparo: tp.titulo_preparo,
          modos_preparo: tp.modosPreparo.map(mp => ({
            id_preparo: mp.id_preparo,
            descricao_preparo: mp.descricao_preparo,
            data_cadastro: mp.data_cadastro,
          })),
        })),

        // Feedbacks
        feedbacks: receita.feedbacks.map(fb => ({
          id_feedback: fb.id_feedback,
          id_usuario: fb.id_usuario,
          feedback: fb.feedback,
          total_estrela: fb.total_estrela,
          data_cadastro: fb.data_cadastro,
          ativo: fb.ativo,
          usuario: fb.usuario.nome,
        })),
        // Estrutura de Substituições
        substituicoes: receita.substituicoes.map(sub => ({
          id_substituicao: sub.id_substituicao,
          descricao_preparo: sub.descricao_preparo,
          quantidade: sub.quantidade,
          ativo: sub.ativo,
          data_cadastro: sub.data_cadastro,
          id_ingrediente: sub.id_ingrediente,
          id_usuario: sub.id_usuario,
          id_uni_medida: sub.id_uni_medida,
          id_tipo_ingrediente: sub.ingrediente.id_tipo_ingrediente,
          descricao_ingrediente: sub.ingrediente.descricao_ingrediente,
          unidade_medida: sub.unidadeMedida.unidade_medida,
          sigla: sub.unidadeMedida.sigla,
          usuario: sub.usuario.nome,
        })),
        // Favoritos
        favoritos: receita.favoritos.map(fr => ({
          id_favorito: fr.id_favorito,
          id_usuario: fr.id_usuario,
          data_cadastro: fr.data_cadastro,
        })),
      }
    });

  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar receita' },
      { status: 500 }
    );
  }
}