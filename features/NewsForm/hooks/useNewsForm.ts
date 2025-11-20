import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { INews } from '../../../types/News';
import { INewsForm } from '../types';
import { validationSchema } from '../constants/validationSchema';
import { useCreateNews, useUpdateNews, useNews } from '../api/useNewsApi';
import { EDITOR_DEFAULT_DATA } from '../constants/editorConfig';

interface UseNewsFormProps {
	news?: INews;
	editorInstance: any;
	onClose?: () => void;
}

export const useNewsForm = ({
	news,
	editorInstance,
	onClose,
}: UseNewsFormProps) => {
	const { createNews } = useCreateNews();
	const { updateNews } = useUpdateNews();
	const { mutate } = useNews();

	const form = useForm<INewsForm>({
		// @ts-ignore - yup resolver types issue
		resolver: yupResolver(validationSchema),
		defaultValues: news ?? {
			title: '',
			content: EDITOR_DEFAULT_DATA,
			images: [],
			banner: '',
			author: '',
			published: false,
		},
	});

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
			mutate();
			onClose?.();
		} catch (error) {
			console.error('Ошибка сохранения:', error);
			alert('Ошибка сохранения новости');
		}
	};

	return {
		form,
		onSubmit,
	};
};

