// app/api/admin/dicas/[id_dica]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';

export async function GET(request, { params }) {
    try {
        // Acessa o parâmetro diretamente (não precisa de await)
        const { id_dica } = params; // Isso já é acessado corretamente
        // Verifica se o ID foi fornecido
        if (!id_dica) {
            return NextResponse.json(
                { success: false, error: 'ID da dica não fornecido' },
                { status: 400 }
            );
        }

        // Busca a dica com as receitas e dicas relacionadas
        const dica = await prisma.dica.findUnique({
            where: {
                id_dica: parseInt(id_dica)
            },
            include: {
                usuario: true, // Inclui o usuário que criou a dica
                categoria: true, // Inclui a categoria da dica
            },
        });

        // Verifica se a dica foi encontrada
        if (!dica) {
            return NextResponse.json(
                { success: false, error: 'Dica não encontrada' },
                { status: 404 }
            );
        }

        // Retorna a dica com sucesso
        return NextResponse.json({
            success: true,
            data: dica,
        });

    } catch (error) {
        console.error('Erro ao buscar dica:', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
};

// PUT: atualiza uma dica existente// PUT: atualiza uma dica existente (com suporte a upload de imagem)
export const PUT = async (request, { params }) => {
    const { id_dica } = params;

    try {
        // Verifica se o ID foi fornecido
        if (!id_dica) {
            return NextResponse.json(
                { success: false, error: 'ID da dica não fornecido' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        // Extrai dados do formulário
        const titulo = formData.get('titulo');
        const descricao = formData.get('descricao');
        const id_categoria = formData.get('id_categoria');
        const cta_text = formData.get('cta_text');
        const ativo = formData.get('ativo');
        const id_usuario = formData.get('id_usuario');
        const imageFile = formData.get('img_dica');

        // Valida campos obrigatórios (exceto imagem que é opcional na atualização)
        if (!titulo || !descricao || !id_categoria || !cta_text) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos textuais são obrigatórios' },
                { status: 400 }
            );
        }

        let imagePath = null;

        // Processa a imagem apenas se foi enviada
        if (imageFile && imageFile.size > 0) {
            // Valida arquivo de imagem
            if (!['image/jpeg', 'image/png'].includes(imageFile.type)) {
                return NextResponse.json(
                    { success: false, error: 'Formato de imagem inválido. Use JPEG ou PNG' },
                    { status: 400 }
                );
            }

            if (imageFile.size > 10 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, error: 'O tamanho da imagem deve ser menor que 10MB' },
                    { status: 400 }
                );
            }

            // Cria diretório de uploads se não existir
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dicas');
            await fs.mkdir(uploadDir, { recursive: true });

            // Gera nome único para o arquivo
            const fileExt = path.extname(imageFile.name);
            const fileName = `${uuidv4()}${fileExt}`;
            const filePath = path.join(uploadDir, fileName);

            // Converte e salva a imagem
            const fileBuffer = await imageFile.arrayBuffer();
            await fs.writeFile(filePath, Buffer.from(fileBuffer));

            // Cria caminho relativo para o banco de dados
            imagePath = `/uploads/dicas/${fileName}`;

            // Opcional: Remove a imagem antiga se existir
            const oldDica = await prisma.dica.findUnique({
                where: { id_dica: parseInt(id_dica) }
            });
            
            if (oldDica?.img_dica) {
                const oldPath = path.join(process.cwd(), 'public', oldDica.img_dica);
                try {
                    await fs.unlink(oldPath);
                } catch (err) {
                    console.warn('Não foi possível remover a imagem antiga:', err);
                }
            }
        }

        // Atualiza a dica no banco de dados
        const updatedDica = await prisma.dica.update({
            where: {
                id_dica: parseInt(id_dica),
            },
            data: {
                titulo,
                descricao,
                cta_text,
                ...(imagePath && { img_dica: imagePath }), // Atualiza imagem apenas se foi enviada
                id_categoria: parseInt(id_categoria),
                id_usuario: parseInt(id_usuario),
                ativo: parseInt(ativo),
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedDica,
            message: 'Dica atualizada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao atualizar dica:', error);
        
        // Tratamento de erros específicos
        if (error.code === 'P2025') {
            return NextResponse.json(
                { success: false, error: 'Dica não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                error: 'Erro ao atualizar dica',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};

export async function DELETE(request, { params }) {
    const { id_dica } = params;

    try {
        // Verifica se o ID foi fornecido
        if (!id_dica) {
            return NextResponse.json(
                { success: false, error: 'ID da dica não fornecido' },
                { status: 400 }
            );
        }

        // Primeiro obtém a dica para pegar o caminho da imagem
        const dica = await prisma.dica.findUnique({
            where: { id_dica: parseInt(id_dica) }
        });

        if (!dica) {
            return NextResponse.json(
                { success: false, error: 'Dica não encontrada' },
                { status: 404 }
            );
        }

        // Remove a dica do banco de dados
        const deletedDica = await prisma.dica.delete({
            where: { id_dica: parseInt(id_dica) },
        });

        // Se existir uma imagem associada, tenta removê-la do sistema de arquivos
        if (dica.img_dica) {
            try {
                const imagePath = path.join(process.cwd(), 'public', dica.img_dica);
                await fs.unlink(imagePath);
            } catch (err) {
                console.warn('Aviso: Não foi possível remover a imagem:', err);
                // Não falha a operação principal se não conseguir remover a imagem
            }
        }

        return NextResponse.json({
            success: true,
            message: `Dica "${deletedDica.titulo}" deletada com sucesso.`,
            deletedId: deletedDica.id_dica
        });

    } catch (error) {
        console.error('Erro ao deletar dica:', error);
        return NextResponse.json({
            success: false,
            error: error.code === 'P2025'
                ? 'Dica não encontrada'
                : 'Erro ao deletar dica',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        }, { status: error.code === 'P2025' ? 404 : 500 });
    }
}