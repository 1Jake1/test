'use client';

import { Control } from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../components/ui/form';
import { INewsForm } from '../types';

interface PublishedFieldProps {
	control: Control<INewsForm>;
}

export default function PublishedField({ control }: PublishedFieldProps) {
	return (
		/* @ts-ignore - react-hook-form types issue */
		<FormField
			control={control}
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
	);
}

