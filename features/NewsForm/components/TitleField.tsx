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

interface TitleFieldProps {
	control: Control<INewsForm>;
}

export default function TitleField({ control }: TitleFieldProps) {
	return (
		/* @ts-ignore - react-hook-form types issue */
		<FormField
			control={control}
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
	);
}

