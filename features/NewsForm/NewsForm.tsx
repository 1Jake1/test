'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { array, boolean, object, ObjectSchema, string } from 'yup';
import type EditorJS from '@editorjs/editorjs';
import { Button } from '../../components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
	useCreateNewsMutation,
	useUpdateNewsMutation,
	useUploadImageMutation,
} from '../../lib/store/newsApi';
import { INews } from '../../types/News';
import { INewsForm } from './types';

export const schema = object({
	title: string().required('Введите заголовок'),
	content: object().optional(),
	images: array().of(string()).optional().default([]),
	author: string().optional(),
	published: boolean().optional().default(false),
});

export default function NewsForm({
	news,
	onClose,
}: {
	news?: INews;
	onClose?: () => void;
}) {
	const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);
	const editorRef = useRef<HTMLDivElement>(null);
	const [uploadImage] = useUploadImageMutation();

	const form = useForm<INewsForm>({
		// @ts-ignore - yup resolver types issue
		resolver: yupResolver(schema),
		defaultValues: news ?? {
			title: '',
			content: {
				blocks: [],
				time: Date.now(),
				version: '2.28.2',
			},
			images: [],
			author: '',
			published: false,
		},
	});

	const [createNews] = useCreateNewsMutation();
	const [updateNews] = useUpdateNewsMutation();

	// Инициализация EditorJS
	useEffect(() => {
		if (!editorRef.current) return;

		let editor: EditorJS | null = null;
		let isMounted = true;

		const initEditor = async () => {
			try {
				// Динамический импорт EditorJS и плагинов
				const [
					EditorJSClass,
					Header,
					List,
					Image,
					LinkTool,
					Paragraph,
					Quote,
					Code,
					Table,
					Embed,
				] = await Promise.all([
					import('@editorjs/editorjs'),
					import('@editorjs/header'),
					import('@editorjs/list'),
					import('@editorjs/image'),
					import('@editorjs/link').catch(() => ({ default: null })),
					import('@editorjs/paragraph'),
					import('@editorjs/quote'),
					import('@editorjs/code'),
					import('@editorjs/table'),
					import('@editorjs/embed').catch(() => ({ default: null })),
				]);

				if (!isMounted || !editorRef.current) return;

				// Уничтожаем предыдущий экземпляр если есть
				if (editorInstance) {
					try {
						await editorInstance.destroy();
					} catch (e) {
						console.warn('Ошибка при уничтожении редактора:', e);
					}
					setEditorInstance(null);
				}

				if (!isMounted || !editorRef.current) return;

				const tools: any = {
					header: {
						class: Header.default,
						config: {
							levels: [1, 2, 3, 4],
							defaultLevel: 2,
						},
					},
					list: {
						class: List.default,
						inlineToolbar: true,
					},
					image: {
						class: Image.default,
						config: {
							uploader: {
								async uploadByFile(file: File) {
									const formData = new FormData();
									formData.append('file', file);
									const result = await uploadImage(formData).unwrap();
									return {
										success: 1,
										file: {
											url: result.url,
										},
									};
								},
							},
						},
					},
					paragraph: {
						class: Paragraph.default,
						inlineToolbar: true,
					},
					quote: {
						class: Quote.default,
						inlineToolbar: true,
					},
					code: Code.default,
					table: {
						class: Table.default,
						inlineToolbar: true,
					},
				};

				// Добавляем опциональные инструменты
				if (LinkTool?.default) {
					tools.linkTool = {
						class: LinkTool.default,
						config: {
							endpoint: '/api/news/link',
						},
					};
				}

				if (Embed?.default) {
					tools.embed = Embed.default;
				}

				editor = new EditorJSClass.default({
					holder: editorRef.current,
					tools,
					data: news?.content || {
						blocks: [],
						time: Date.now(),
						version: '2.28.2',
					},
				});

				await editor.isReady;

				if (isMounted) {
					setEditorInstance(editor);
				}
			} catch (error) {
				console.error('Ошибка инициализации EditorJS:', error);
			}
		};

		initEditor();

		return () => {
			isMounted = false;
			if (editor) {
				try {
					editor.destroy();
				} catch (e) {
					console.warn('Ошибка при уничтожении редактора:', e);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [news?._id]);

	const onSubmit: SubmitHandler<INewsForm> = async values => {
		if (!editorInstance) {
			alert('Редактор еще не загружен');
			return;
		}

		try {
			const outputData = await editorInstance.save();
			const newsData = {
				...values,
				content: outputData,
			};

			if (news?._id) {
				await updateNews({ ...newsData, _id: news._id });
			} else {
				await createNews(newsData);
			}
			onClose?.();
		} catch (error) {
			console.error('Ошибка сохранения:', error);
			alert('Ошибка сохранения новости');
		}
	};

	return (
		<Form {...form}>
			{/* @ts-ignore - react-hook-form types issue */}
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				{/* @ts-ignore - react-hook-form types issue */}
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem name='title'>
							<FormLabel name='title'>Заголовок</FormLabel>
							<FormControl name='title'>
								<Input placeholder='Введите заголовок новости' {...field} />
							</FormControl>
							<FormMessage name='title' />
						</FormItem>
					)}
				/>
				{/* @ts-ignore - react-hook-form types issue */}
				<FormField
					control={form.control}
					name='author'
					render={({ field }) => (
						<FormItem name='author'>
							<FormLabel name='author'>Автор</FormLabel>
							<FormControl name='author'>
								<Input placeholder='Имя автора' {...field} />
							</FormControl>
							<FormMessage name='author' />
						</FormItem>
					)}
				/>
				{/* @ts-ignore - react-hook-form types issue */}
				<FormField
					control={form.control}
					name='published'
					render={({ field }) => (
						<FormItem name='published' className='flex flex-row items-center space-x-3 space-y-0'>
							<FormControl name='published'>
								<input
									type='checkbox'
									checked={field.value || false}
									onChange={field.onChange}
									className='h-4 w-4 rounded border-gray-300'
								/>
							</FormControl>
							<FormLabel name='published' className='!mt-0'>
								Опубликовано
							</FormLabel>
							<FormMessage name='published' />
						</FormItem>
					)}
				/>
				{/* @ts-ignore - react-hook-form types issue */}
				<FormField
					control={form.control}
					name='content'
					render={() => (
						<FormItem name='content'>
							<FormLabel name='content'>Содержимое</FormLabel>
							<FormControl name='content'>
								<div
									ref={editorRef}
									className='min-h-[300px] border rounded-md p-4'
								/>
							</FormControl>
							<FormMessage name='content' />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					{news ? 'Обновить' : 'Создать'}
				</Button>
			</form>
		</Form>
	);
}

