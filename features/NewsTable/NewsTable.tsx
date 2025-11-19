'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog';
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/ui/table';
import { useGetNewsQuery } from '../../lib/store/newsApi';
import { INews } from '../../types/News';
import NewsForm from '../NewsForm/NewsForm';
import NewsTableRow from './components/NewsTableRow';

export default function NewsTable() {
	const [selectedNews, setSelectedNews] = useState<INews | null>(null);
	const [open, setOpen] = useState(false);

	const { data: news = [] } = useGetNewsQuery();

	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<div className='flex justify-between mb-4 sm:flex-row flex-col'>
					<h2 className='text-xl font-semibold'>Список новостей</h2>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setSelectedNews(null);
								setOpen(true);
							}}
						>
							Добавить новость
						</Button>
					</DialogTrigger>
				</div>
				<Table>
					<TableCaption>Все новости</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Заголовок</TableHead>
							<TableHead>Автор</TableHead>
							<TableHead>Опубликовано</TableHead>
							<TableHead>Дата создания</TableHead>
							<TableHead className='text-right'>Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{news.map(newsItem => (
							<NewsTableRow
								news={newsItem}
								setOpen={setOpen}
								setSelectedNews={setSelectedNews}
								key={newsItem._id}
							/>
						))}
					</TableBody>
				</Table>

				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>
							{selectedNews ? 'Редактировать новость' : 'Создать новость'}
						</DialogTitle>
						<DialogDescription>
							{selectedNews
								? 'Измените данные новости и сохраните изменения.'
								: 'Введите данные новой новости.'}
						</DialogDescription>
					</DialogHeader>
					<NewsForm
						news={selectedNews ?? undefined}
						onClose={() => setOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

