// lib/upload.ts
import { put } from '@vercel/blob';

export const uploadImage = async (file: File, path: string) => {
    const blob = await put(path, file, {
        access: 'public',
    });
    return blob.url;
};