// app/api/usuarios/[id]/imagem/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';
import { promises as fs } from 'fs';
import { prisma } from '../../../../lib/prisma';
import path from 'path';

export const PUT = async (request, { params }) => {
    try {
        const { id } = await params;
        const userId = parseInt(id);
        //const session = await getServerSession(authOptions);

        // Verificar se o usuário está autenticado e é o dono da conta
        //if (!session?.user?.id || session.user.id !== parseInt(userId)) {
         //   return NextResponse.json(
         //       { error: 'Não autorizado' },
          //      { status: 401 }
          //  );
        //}
        //verificar se é usuario valido
        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json(
                { error: 'Nenhuma imagem enviada' },
                { status: 400 }
            );
        }

        // Configure upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'usuarios');

        try {
            await fs.access(uploadDir);
        } catch (error) {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const fileName = `user-${userId}-${Date.now()}${path.extname(file.name)}`;
        const filePath = path.join(uploadDir, fileName);
        const imageUrl = `/uploads/usuarios/${fileName}`;

        // Write file
        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));

        // Update user record in database - usando o nome correto do campo
        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: {
                img_usuario: imageUrl // Alterado de 'imagem' para 'img_usuario'
            },
        });

        return NextResponse.json({
            success: true,
            imageUrl: imageUrl,
            user: updatedUser
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        return NextResponse.json(
            {
                error: 'Erro interno no servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
};