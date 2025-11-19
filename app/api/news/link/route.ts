import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { url } = await req.json();
		
		// Простая реализация для LinkTool
		// В реальном приложении можно добавить метаданные из URL
		return NextResponse.json({
			success: 1,
			link: url,
			meta: {
				title: url,
				description: '',
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ success: 0, error: 'Ошибка обработки ссылки' },
			{ status: 500 }
		);
	}
}

