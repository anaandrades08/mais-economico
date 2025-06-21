// app/api/admin/dicas/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@app/lib/prisma';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '1');

        const [dicas, total] = await prisma.$transaction([
            prisma.dica.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { data_cadastro: 'desc' },
                select: {
                    id_dica: true,
                    titulo: true,
                    descricao: true,
                    cta_text: true,
                    img_dica: true,
                    ativo: true,
                    data_cadastro: true,
                    id_categoria: true,
                    id_usuario: true,
                    categoria: {
                        select: {
                            nome: true
                        }
                    },
                    usuario: {
                        select: {
                            nome: true
                        }
                    },
                }
            }),
            prisma.dica.count()
        ]);

        return NextResponse.json({
            success: true,
            data: dicas,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar dicas:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar dicas',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}


export const POST = async (request) => {
    try {
        const formData = await request.formData();

        // Extract form data
        const titulo = formData.get('titulo');
        const descricao = formData.get('descricao');
        const id_categoria = parseInt(formData.get('id_categoria'));
        const cta_text = formData.get('cta_text');
        const ativo = parseInt(formData.get('ativo'));
        const id_usuario = parseInt(formData.get('id_usuario'));
        const imageFile = formData.get('img_dica');

        // Validate required fields
        if (!titulo || !descricao || !id_categoria || !cta_text || !imageFile) {
            return NextResponse.json(
                { success: false, error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Validate image file
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

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dicas');
        await fs.mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const fileExt = path.extname(imageFile.name);
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);

        // Convert image file to buffer and save to disk
        const fileBuffer = await imageFile.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        // Create relative path for database storage
        const imagePath = `/uploads/dicas/${fileName}`;

        // Create dica in database
        const newDica = await prisma.dica.create({
            data: {
                titulo,
                descricao,
                cta_text,
                img_dica: imagePath,
                data_cadastro: new Date(),
                ativo,
                id_categoria,
                id_usuario
            }
        });

        return NextResponse.json({
            success: true,
            data: newDica,
            message: 'Dica cadastrada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar dica:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao cadastrar dica',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
};
