import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { News } from '../../../models/News';
import { join } from 'path';
import { existsSync } from 'fs';
import { rename, mkdir, readdir, unlink } from 'fs/promises';

/**
 * Обрабатывает изображения в content: перемещает из temp в uploads с добавлением id новости
 */
async function processImages(content: any, newsId: string): Promise<any> {
	if (!content || !content.blocks) {
		return content;
	}

	const processedBlocks = await Promise.all(
		content.blocks.map(async (block: any) => {
			// Обрабатываем только блоки типа image
			if (block.type === 'image' && block.data?.file?.url) {
				const imageUrl = block.data.file.url;

				// Проверяем, находится ли изображение в temp (не трогаем уже сохраненные в uploads)
				if (imageUrl.startsWith('/temp/')) {
					const tempFilename = imageUrl.replace('/temp/', '');
					const tempPath = join(process.cwd(), 'public', 'temp', tempFilename);
					const uploadsDir = join(process.cwd(), 'public', 'uploads');

					// Создаем директорию uploads если её нет
					if (!existsSync(uploadsDir)) {
						await mkdir(uploadsDir, { recursive: true });
					}

					// Проверяем существование файла в temp
					if (existsSync(tempPath)) {
						// Генерируем новое имя файла с id новости
						const fileExtension = tempFilename.split('.').pop() || '';
						const baseName = tempFilename.replace(`.${fileExtension}`, '');
						const newFilename = `${newsId}-${baseName}.${fileExtension}`;
						const uploadPath = join(uploadsDir, newFilename);

						// Перемещаем файл
						try {
							await rename(tempPath, uploadPath);
							// Обновляем URL в блоке
							block.data.file.url = `/uploads/${newFilename}`;
						} catch (error) {
							console.error(`Ошибка перемещения файла ${tempFilename}:`, error);
							// В случае ошибки оставляем оригинальный URL
						}
					}
				}
				// Если изображение уже в uploads, не трогаем его
			}

			return block;
		})
	);

	return {
		...content,
		blocks: processedBlocks,
	};
}

/**
 * Обрабатывает баннер: перемещает из temp в uploads с добавлением id новости
 */
async function processBanner(bannerUrl: string | undefined, newsId: string): Promise<string | undefined> {
	if (!bannerUrl || !bannerUrl.startsWith('/temp/')) {
		return bannerUrl;
	}

	const tempFilename = bannerUrl.replace('/temp/', '');
	const tempPath = join(process.cwd(), 'public', 'temp', tempFilename);
	const uploadsDir = join(process.cwd(), 'public', 'uploads');

	// Создаем директорию uploads если её нет
	if (!existsSync(uploadsDir)) {
		await mkdir(uploadsDir, { recursive: true });
	}

	// Проверяем существование файла в temp
	if (existsSync(tempPath)) {
		// Генерируем новое имя файла с id новости
		const fileExtension = tempFilename.split('.').pop() || '';
		const baseName = tempFilename.replace(`.${fileExtension}`, '');
		const newFilename = `${newsId}-banner-${baseName}.${fileExtension}`;
		const uploadPath = join(uploadsDir, newFilename);

		// Перемещаем файл
		try {
			await rename(tempPath, uploadPath);
			return `/uploads/${newFilename}`;
		} catch (error) {
			console.error(`Ошибка перемещения баннера ${tempFilename}:`, error);
			return bannerUrl;
		}
	}

	return bannerUrl;
}

/**
 * Очищает неиспользуемые файлы из temp
 */
async function cleanupTempFiles(content: any, banner?: string) {
	const tempDir = join(process.cwd(), 'public', 'temp');
	if (!existsSync(tempDir)) {
		return;
	}

	// Получаем список всех файлов в temp
	const tempFiles = await readdir(tempDir);

	// Собираем все URL изображений из content и banner
	const usedImageUrls = new Set<string>();
	
	// Добавляем баннер если он в temp
	if (banner && banner.startsWith('/temp/')) {
		usedImageUrls.add(banner.replace('/temp/', ''));
	}

	// Добавляем изображения из content
	if (content && content.blocks) {
		content.blocks.forEach((block: any) => {
			if (block.type === 'image' && block.data?.file?.url) {
				const url = block.data.file.url;
				if (url.startsWith('/temp/')) {
					usedImageUrls.add(url.replace('/temp/', ''));
				}
			}
		});
	}

	// Удаляем неиспользуемые файлы
	await Promise.all(
		tempFiles.map(async (filename) => {
			if (!usedImageUrls.has(filename)) {
				const filePath = join(tempDir, filename);
				try {
					await unlink(filePath);
				} catch (error) {
					console.error(`Ошибка удаления файла ${filename}:`, error);
				}
			}
		})
	);
}

export async function GET() {
	await connectDB();
	const news = await News.find().sort({ createdAt: -1 });
	return NextResponse.json(news);
}

export async function POST(req: Request) {
	try {
		await connectDB();
		const data = await req.json();

		// Создаем новость для получения id
		const news = await News.create(data);
		const newsId = news._id.toString();

		// Обрабатываем баннер
		if (data.banner) {
			const processedBanner = await processBanner(data.banner, newsId);
			news.banner = processedBanner;
		}

		// Обрабатываем изображения в content
		if (data.content) {
			const processedContent = await processImages(data.content, newsId);
			// Обновляем новость с обработанным content
			news.content = processedContent;
		}

		await news.save();

		// Очищаем неиспользуемые файлы из temp
		await cleanupTempFiles(data.content, data.banner);

		return NextResponse.json(news, { status: 201 });
	} catch (error) {
		console.error('Ошибка создания новости:', error);
		return NextResponse.json(
			{ error: 'Ошибка создания новости' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request) {
	try {
		await connectDB();
		const { _id, ...update } = await req.json();
		const newsId = _id;

		// Обрабатываем баннер
		if (update.banner) {
			update.banner = await processBanner(update.banner, newsId);
		}

		// Обрабатываем изображения в content перед обновлением
		if (update.content) {
			update.content = await processImages(update.content, newsId);
		}

		const news = await News.findByIdAndUpdate(_id, update, { new: true });

		// Очищаем неиспользуемые файлы из temp
		await cleanupTempFiles(update.content, update.banner);

		return NextResponse.json(news);
	} catch (error) {
		console.error('Ошибка обновления новости:', error);
		return NextResponse.json(
			{ error: 'Ошибка обновления новости' },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: Request) {
	await connectDB();
	const { id } = await req.json();
	await News.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}

