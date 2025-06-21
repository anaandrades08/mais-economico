// app/api/usuarios/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany({
            orderBy: {
                data_cadastro: 'desc',
            },
            select: {
                id: true,
                nome: true,
                email: true,
                senha: true,
                telefone: true,
                endereco: true,
                numero: true,
                cidade: true,
                estado: true,
                cep: true,
                img_usuario: true,
                data_cadastro: true,
                tipo: true,
                ativo: true
            }
        })

        return NextResponse.json(usuarios)
    } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuários' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

///////////////////////////////////////// POST - CADASTRAR USUÁRIO /////////////////////////////////////////////
// Função para criar um novo usuario
export const POST = async (request) => {
  try {
    const body = await request.json();    

    // Validação básica
    if (!body.email || !body.senha || !body.nome || !body.endereco || !body.numero || !body.cidade || !body.estado || !body.cep) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }
    
    // Verifica se usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: body.email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }
    // Define valores padrão se não forem fornecidos
    const userData = {
      ...body
    };

    const novoUser = await prisma.usuario.create({
      data: userData,
    });
    
    return NextResponse.json(novoUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar conta de usuário',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
};

////////////////////////////// POR ID //////////////////////////////////////////////////////
/*export const GET = async (request) => {
  try {
    const data = await request.json(); // Lê o corpo da requisição
    const { id } = data; // Extrai o id do corpo

    // Se id for fornecido, busca o usuário pelo id
    if (id) {
      const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          nome: true,
          email: true,
          senha: true,
          telefone: true,
          endereco: true,
          numero: true,
          cidade: true,
          estado: true,
          cep: true,
          img_usuario: true,
          data_cadastro: true,
          tipo: true,
          ativo: true,
          receitas: {
            select: {
              id_receita: true,
              titulo_receita: true,
              descricao_receita: true,
              tempo_preparo: true,
              tempo_total: true,
              rendimento: true,
              custo: true,
              dificuldade: true,
              img_receita: true,
              data_cadastro: true,
            },
          },
          feedbacks: {
            select: {
              id_feedback: true,
              feedback: true,
              total_estrela: true,
              data_cadastro: true,
            },
          },
          substituicoes: {
            select: {
              id_substituicao: true,
              descricao_preparo: true,
              quantidade: true,
              data_cadastro: true,
              ingrediente: {
                select: {
                  descricao_ingrediente: true,
                },
              },
              unidadeMedida: {
                select: {
                  unidade_medida: true,
                  sigla: true,
                },
              },
            },
          },
          favoritos: {
            select: {
              id_favorito: true,
              receita: {
                select: {
                  id_receita: true,
                  titulo_receita: true,
                },
              },
              data_cadastro: true,
            },
          },
        },
      });

      if (!usuario) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      return NextResponse.json(usuario);
    } else {
      // Se id não for fornecido, retorna todos os usuários
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          senha: true,
          telefone: true,
          endereco: true,
          numero: true,
          cidade: true,
          estado: true,
          cep: true,
          img_usuario: true,
          data_cadastro: true,
          tipo: true,
          ativo: true,
          receitas: {
            select: {
              id_receita: true,
              titulo_receita: true,
              descricao_receita: true,
              tempo_preparo: true,
              tempo_total: true,
              rendimento: true,
              custo: true,
              dificuldade: true,
              img_receita: true,
              data_cadastro: true,
            },
          },
          feedbacks: {
            select: {
              id_feedback: true,
              feedback: true,
              total_estrela: true,
              data_cadastro: true,
            },
          },
          substituicoes: {
            select: {
              id_substituicao: true,
              descricao_preparo: true,
              quantidade: true,
              data_cadastro: true,
              ingrediente: {
                select: {
                  descricao_ingrediente: true,
                },
              },
              unidadeMedida: {
                select: {
                  unidade_medida: true,
                  sigla: true,
                },
              },
            },
          },
          favoritos: {
            select: {
              id_favorito: true,
              receita: {
                select: {
                  id_receita: true,
                  titulo_receita: true,
                },
              },
              data_cadastro: true,
            },
          },
        },
      });

      return NextResponse.json(usuarios);
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
  }
};*/


////////////////////////////// ALTERAR POR ID //////////////////////////////////////////////////////
export const PUT = async (request) => {
  try {
    const data = await request.json(); // Pega todo o body de uma vez
    const { id, nome, email, senha, telefone, endereco, numero, cidade, estado, cep, img_usuario, tipo, ativo } = data; // Campos que podem ser atualizados

    // Atualizar o cadastro do usuário no banco
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        email,
        senha,
        telefone,
        endereco,
        numero,
        cidade,
        estado,
        cep,
        img_usuario,
        tipo,
        ativo,
      },
    });

    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
};

////////////////////////////// EXCLUIR POR ID //////////////////////////////////////////////////////
export const DELETE = async (request) => {
  try {
    const data = await request.json(); // Pega o body da requisição
    const { id } = data; // Pega o ID do usuário

    
    // Deletar dicas associadas ao usuário
    await prisma.dica.deleteMany({
        where: { id_usuario: parseInt(id) }
      });
  
      // Deletar substituicao associados ao usuário
      await prisma.substituicao.deleteMany({
        where: { id_usuario: parseInt(id) }
      });
  
      // Deletar favoritos associados ao usuário
      await prisma.favorito.deleteMany({
        where: { id_usuario: parseInt(id) }
      });
  
      // Deletar os modos de preparo das receitas do usuário
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
  
      // Deletar os títulos de preparo das receitas do usuário
      await prisma.tituloPreparo.deleteMany({
        where: { receita: { id_usuario: parseInt(id) } }
      });
  
      // Deletar os ingredientes das receitas do usuário
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
  
      // Deletar os títulos de ingredientes das receitas do usuário
      await prisma.tituloIngredientesReceita.deleteMany({
        where: { receita: { id_usuario: parseInt(id) } }
      });
  
      // Deletar a receita associada ao usuário
      await prisma.receita.deleteMany({
        where: { id_usuario: parseInt(id) },
      });
  
      // Agora, deletar o usuário
      await prisma.usuario.delete({
        where: { id: parseInt(id) }
      });

    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o usuário:', error);
    return NextResponse.json({ error: 'Erro ao excluir o usuário' }, { status: 500 });
  }
};