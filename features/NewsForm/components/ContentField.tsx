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
import Editor from './Editor';

interface ContentFieldProps {
	control: Control<INewsForm>;
	editorRef: React.RefObject<HTMLDivElement>;
}

export default function ContentField({ control, editorRef }: ContentFieldProps) {
	return (
		/* @ts-ignore - react-hook-form types issue */
		<FormField
			control={control}
			name='content'
			render={() => (
				<FormItem name='content'>
					<FormLabel name='content'>Содержимое</FormLabel>
					<FormControl name='content'>
						<Editor editorRef={editorRef} />
					</FormControl>
					<FormMessage name='content' />
				</FormItem>
			)}
		/>
	);
}

