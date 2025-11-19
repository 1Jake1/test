import { array, boolean, object, string } from 'yup';
import { INewsForm } from '../types';

export const validationSchema = object({
	title: string().required('Введите заголовок'),
	content: object().optional(),
	images: array().of(string()).optional().default([]),
	author: string().optional(),
	published: boolean().optional().default(false),
});

