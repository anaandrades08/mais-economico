import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export const PUT = async (request, { params }) => {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID de usuário obrigatório' },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhuma imagem enviada' },
        { status: 400 }
      );
    }

    // Verificar tipo de arquivo
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      return NextResponse.json(
        { error: 'Formato inválido. Use apenas JPEG ou PNG' },
        { status: 400 }
      );
    }

    // Verificar tamanho do arquivo (2MB máximo)
    const fileBuffer = await file.arrayBuffer();
    if (fileBuffer.byteLength > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'A imagem deve ter no máximo 2MB' },
        { status: 400 }
      );
    }

    // Criar nome único para o arquivo
    const filename = `user-${id}-${Date.now()}${path.extname(file.name)}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads/usuarios', filename);

    // Salvar arquivo no sistema
    await writeFile(filepath, Buffer.from(fileBuffer));

    const imageUrl = `/uploads/usuarios/${filename}`;

    // Atualizar usuário no banco de dados
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { img_usuario: imageUrl }
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao processar imagem' },
      { status: 500 }
    );
  }
};