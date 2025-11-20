import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'Файл не найден' },
				{ status: 400 }
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Создаем директорию temp если её нет
		const tempDir = join(process.cwd(), 'public', 'temp');
		if (!existsSync(tempDir)) {
			await mkdir(tempDir, { recursive: true });
		}

		// Генерируем уникальное имя файла
		const timestamp = Date.now();
		const filename = `${timestamp}-${file.name}`;
		const filepath = join(tempDir, filename);

		await writeFile(filepath, buffer);

		// Возвращаем URL для доступа к файлу
		const url = `/temp/${filename}`;

		return NextResponse.json({ url });
	} catch (error) {
		console.error('Ошибка загрузки файла:', error);
		return NextResponse.json(
			{ error: 'Ошибка загрузки файла' },
			{ status: 500 }
		);
	}
}

