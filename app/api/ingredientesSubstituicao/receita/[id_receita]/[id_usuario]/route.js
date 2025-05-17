// app/api/ingredientesSubstituicao/receita/[id_receita]/[id_usuario]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';
//cria uma substituicao por id_receita e usuario
export const POST = async (request, { params }) => {
  try {
    const { id_receita,id_usuario } = await params;
    const recipeId = parseInt(id_receita);
    const userId = parseInt(id_usuario);
    //verificar se é receita valida
    if (isNaN(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: 'ID da receita inválido' },
        { status: 400 }
      );
    }
        //verificar se é usuario valido
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'ID da usuario inválido' },
        { status: 400 }
      );
    }
    // Lê o corpo da requisição, que deve conter os dados da substituição
    const data = await request.json();

    // Valida se os dados necessários estão presentes
    if (!data.id_ingrediente || !data.id_usuario || !data.id_uni_medida || !data.quantidade) {
      return NextResponse.json(
        { error: 'Dados insuficientes para criar a substituição' },
        { status: 400 }
      );
    }

    // Cria uma nova substituição de ingrediente para a receita especificada
    const substituicaoCriada = await prisma.substituicao.create({
      data: {
        id_receita: recipeId,
        id_ingrediente: data.id_ingrediente,
        id_usuario: userId,
        descricao_preparo: data.descricao_preparo || null, 
        quantidade: data.quantidade,
        id_uni_medida: data.id_uni_medida,
        ativo: null, 
      },
    });

    // Retorna a substituição criada
    return NextResponse.json(substituicaoCriada, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar substituição de ingrediente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar substituição de ingrediente' },
      { status: 500 }
    );
  }
}