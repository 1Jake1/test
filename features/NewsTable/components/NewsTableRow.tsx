import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { TableCell, TableRow } from '../../../components/ui/table';
import { useDeleteNewsMutation } from '../../../lib/store/newsApi';
import { INews } from '../../../types/News';

interface NewsTableRowProps {
	news: INews;
	setSelectedNews: (news: INews) => void;
	setOpen: (isOpen: boolean) => void;
}

export default function NewsTableRow({
	news,
	setSelectedNews,
	setOpen,
}: NewsTableRowProps) {
	const [deleteNews] = useDeleteNewsMutation();

	const formatDate = (date?: Date | string) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('ru-RU');
	};

	return (
		<TableRow key={news._id}>
			<TableCell className='max-w-[300px] truncate'>{news.title}</TableCell>
			<TableCell>{news.author || '-'}</TableCell>
			<TableCell>{news.published ? 'Да' : 'Нет'}</TableCell>
			<TableCell>{formatDate(news.createdAt)}</TableCell>
			<TableCell className='text-right'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<MoreVertical className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem
							onClick={() => {
								setSelectedNews(news);
								setOpen(true);
							}}
						>
							<Pencil className='h-4 w-4 mr-2' />
							Редактировать
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-destructive focus:text-destructive'
							onClick={() => deleteNews(news._id!)}
						>
							<Trash2 className='h-4 w-4 mr-2' />
							Удалить
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

