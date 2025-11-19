'use client';

import { Button } from '../../components/ui/button';
import { Form } from '../../components/ui/form';
import { INews } from '../../types/News';
import { useEditor } from './hooks/useEditor';
import { useNewsForm } from './hooks/useNewsForm';
import TitleField from './components/TitleField';
import AuthorField from './components/AuthorField';
import PublishedField from './components/PublishedField';
import ContentField from './components/ContentField';

interface NewsFormProps {
	news?: INews;
	onClose?: () => void;
}

export default function NewsForm({ news, onClose }: NewsFormProps) {
	const { editorInstance, editorRef } = useEditor({
		initialData: news?.content,
		newsId: news?._id,
	});

	const { form, onSubmit } = useNewsForm({
		news,
		editorInstance,
		onClose,
	});

	return (
		<Form {...form}>
			{/* @ts-ignore - react-hook-form types issue */}
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				{/* @ts-ignore - react-hook-form types issue */}
				<TitleField control={form.control} />
				{/* @ts-ignore - react-hook-form types issue */}
				<AuthorField control={form.control} />
				{/* @ts-ignore - react-hook-form types issue */}
				<PublishedField control={form.control} />
				{/* @ts-ignore - react-hook-form types issue */}
				<ContentField control={form.control} editorRef={editorRef as React.RefObject<HTMLDivElement>} />
				<Button type='submit' className='w-full'>
					{news ? 'Обновить' : 'Создать'}
				</Button>
			</form>
		</Form>
	);
}
