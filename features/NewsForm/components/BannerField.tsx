'use client';

import { Control } from 'react-hook-form';
import { useState, useRef } from 'react';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { INewsForm } from '../types';
import { useUploadImage } from '../api/useNewsApi';

interface BannerFieldProps {
	control: Control<INewsForm>;
}

export default function BannerField({ control }: BannerFieldProps) {
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { uploadImage } = useUploadImage();

	return (
		/* @ts-ignore - react-hook-form types issue */
		<FormField
			control={control}
			name='banner'
			render={({ field }) => {
				const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
					const file = event.target.files?.[0];
					if (!file) return;

					// Проверяем тип файла
					if (!file.type.startsWith('image/')) {
						alert('Пожалуйста, выберите изображение');
						return;
					}

					setIsUploading(true);
					try {
						const formData = new FormData();
						formData.append('file', file);
						const result = await uploadImage(formData);
						
						// Обновляем значение поля
						field.onChange(result.url);
					} catch (error) {
						console.error('Ошибка загрузки баннера:', error);
						alert('Ошибка загрузки изображения');
					} finally {
						setIsUploading(false);
						// Сбрасываем input
						if (fileInputRef.current) {
							fileInputRef.current.value = '';
						}
					}
				};

				return (
				<FormItem name='banner'>
					<FormLabel name='banner'>Баннер</FormLabel>
					<FormControl name='banner'>
						<div className='space-y-2'>
							<Input
								type='text'
								placeholder='URL баннера или загрузите файл'
								{...field}
							/>
							<div className='flex items-center gap-2'>
								<Button
									type='button'
									variant='outline'
									onClick={() => fileInputRef.current?.click()}
									disabled={isUploading}
								>
									{isUploading ? 'Загрузка...' : 'Выбрать файл'}
								</Button>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleFileSelect}
									className='hidden'
								/>
							</div>
							{field.value && (
								<div className='mt-2'>
									<img
										src={field.value}
										alt='Баннер'
										className='max-w-full h-auto max-h-48 rounded-md border'
										onError={(e) => {
											e.currentTarget.style.display = 'none';
										}}
									/>
								</div>
							)}
						</div>
					</FormControl>
					<FormMessage name='banner' />
				</FormItem>
				);
			}}
		/>
	);
}

