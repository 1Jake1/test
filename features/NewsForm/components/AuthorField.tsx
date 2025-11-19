'use client';

import { Control } from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { INewsForm } from '../types';

interface AuthorFieldProps {
	control: Control<INewsForm>;
}

export default function AuthorField({ control }: AuthorFieldProps) {
	return (
		/* @ts-ignore - react-hook-form types issue */
		<FormField
			control={control}
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
	);
}

