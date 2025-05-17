// utils/fileSystem.js
import { mkdir, access } from 'fs/promises';
import path from 'path';

export async function ensureUploadsDir() {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'usuarios');
    
    try {
        await access(uploadDir);
    } catch {
        await mkdir(uploadDir, { recursive: true, mode: 0o755 });
        console.log(`Pasta de uploads criada: ${uploadDir}`);
    }
}

// Chame no início do seu endpoint
await ensureUploadsDir();