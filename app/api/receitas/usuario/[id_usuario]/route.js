// app/api/receitas/usuario/[id_usuario]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Função para obter o receitas pelo ID do usuário
export const GET = async (req, { params }) => {
  const { id_usuario } = params;
  try {
    const receitas = await prisma.receita.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
      },
      orderBy: {
        data_cadastro: 'desc',
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
                    id_ingrediente:true,
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
        }
      }
    });

    if (receitas.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma receita encontrada para este usuário' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      receitas: receitas.map(rec => ({
        //dados da receita
        id_receita:         rec.id_receita,
        id_categoria:       rec.id_categoria,
        titulo_receita:     rec.titulo_receita,
        descricao_receita:  rec.descricao_receita,
        tempo_preparo:      rec.tempo_preparo,
        tempo_total:        rec.tempo_total,
        rendimento:         rec.rendimento,
        custo:              rec.custo,
        dificuldade:        rec.dificuldade,
        img_receita:        rec.img_receita,
        ativo:              rec.ativo,
        aceito_termo:       rec.aceito_termo,
        data_cadastro:      rec.data_cadastro,
        //include categoria
        titulo_categoria:   rec.categoria.nome,
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
    console.error('Erro ao buscar receitas para usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar receitas para usuário' },
      { status: 500 }
    );
  }
}

//função para criar receita para o usuário
export const POST = async (req, { params }) => {
  const { id_usuario } = params;
  const body = await req.json();

  if (!id_usuario) {
    return NextResponse.json({ error: 'ID do usuário não encontrado' }, { status: 400 });
  }

  try {
    // Cria a receita principal
    const novaReceita = await prisma.receita.create({
      data: {
        id_usuario: parseInt(id_usuario),
        id_categoria: body.id_categoria,
        titulo_receita: body.titulo_receita,
        descricao_receita: body.descricao_receita,
        tempo_preparo: body.tempo_preparo,
        tempo_total: body.tempo_total,
        rendimento: body.rendimento,
        custo: body.custo,
        dificuldade: body.dificuldade,
        img_receita: body.img_receita,
        ativo: body.ativo,
        data_cadastro: new Date(),

        titulosIngrediente: {
          create: body.titulos_ingredientes.map(tituloIng => ({
            titulo_ingrediente_receita: tituloIng.titulo_ingrediente_receita,
            ingredientes: {
              create: tituloIng.ingredientes.map(ing => ({
                quantidade: ing.quantidade,
                data_cadastro: new Date(),
                id_ingrediente: ing.id_ingrediente,
                id_uni_medida: ing.id_uni_medida,
              })),
            },
          })),
        },

        titulosPreparo: {
          create: body.titulos_preparo.map(tituloPrep => ({
            titulo_preparo: tituloPrep.titulo_preparo,
            modosPreparo: {
              create: tituloPrep.modos_preparo.map(mp => ({
                descricao_preparo: mp.descricao_preparo,
                data_cadastro: new Date(),
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json({ message: 'Receita criada com sucesso', receita: novaReceita });

  } catch (error) {
    console.error('Erro ao criar receita do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar receita do usuário' },
      { status: 500 }
    );
  }
};