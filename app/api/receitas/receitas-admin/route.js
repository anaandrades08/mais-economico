//app/api/receitas/receitas-admin/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@app/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '1');
        const filter = searchParams.get('filter') || 'all';

        // Mapeia os filtros para condições do Prisma
        const filterConditions = {
            'all': {},
            'novas': { ativo: null },
            'aprovadas': { ativo: 1 },
            'reprovadas': { ativo: 2 },
            'inativas': { ativo: 0 }
        };
        const whereCondition = filterConditions[filter] || {};

        const [receitas, total] = await prisma.$transaction([
            prisma.receita.findMany({
                where: whereCondition,
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { data_cadastro: 'desc' },
                select: {
                    id_receita: true,
                    titulo_receita: true,
                    descricao_receita: true,
                    id_categoria: true,
                    img_receita: true,
                    ativo: true,
                    data_cadastro: true,
                    usuario: {
                        select: {
                            nome: true // pega o nome do usuário
                        }
                    },
                    categoria: {
                        select: {
                            nome: true // pega o nome da categoria
                        }
                    }
                }
            }),
            prisma.receita.count()
        ]);

        return NextResponse.json({
            success: true,
            data: receitas,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao buscar receitas',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json(); // Get JSON instead of form data
        
        // Process image (you'll need to handle base64 if sending from frontend)
        let imagePath = '/images/layout/recipe/image-not-found.png';
        
        if (body.img_receita && body.img_receita.startsWith('data:image')) {
            // Handle base64 image upload
            const matches = body.img_receita.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1];
                const data = matches[2];
                const buffer = Buffer.from(data, 'base64');
                
                // Create directory structure
                const categoriaDir = path.join(process.cwd(), 'public', 'uploads', 'receitas', body.id_categoria.toString());
                if (!fs.existsSync(categoriaDir)) {
                    fs.mkdirSync(categoriaDir, { recursive: true });
                }
                
                // Generate filename
                const filename = `${body.titulo_receita.replace(/\s+/g, '-').toLowerCase()}_${Date.now()}.${ext}`;
                const filePath = path.join(categoriaDir, filename);
                
                // Save file
                fs.writeFileSync(filePath, buffer);
                imagePath = `/uploads/receitas/${body.id_categoria}/${filename}`;
            }
        }

        // Preparar dados para criação
        const novaReceita = {
            titulo_receita: body.titulo_receita,
            descricao_receita: body.descricao_receita,
            ativo: parseInt(body.ativo || 1),
            id_usuario: parseInt(body.id_usuario || 0),
            id_categoria: categoriaId,
            tempo_preparo: parseInt(body.tempo_preparo || 0),
            tempo_total: parseInt(body.tempo_total || 0),
            rendimento: body.rendimento || null,
            custo: parseFloat(body.custo || 0),
            dificuldade: body.dificuldade || null,
            aceito_termo: body.aceito_termos === 'on' ? 1 : 0,
            img_receita: imagePath
        }

        // Criar a nova receita
        const receitaCriada = await prisma.receita.create({
            data: novaReceita,
        })

        return NextResponse.json(
            {
                success: true,
                data: receitaCriada,
                message: 'Receita criada com sucesso'
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Erro POST:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Erro ao criar receita',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        )
    }
}