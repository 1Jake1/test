import { useEffect, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { createEditorTools, EDITOR_DEFAULT_DATA } from '../constants/editorConfig';
import { useUploadImage } from '../api/useNewsApi';

interface UseEditorProps {
	initialData?: any;
	newsId?: string;
}

export const useEditor = ({ initialData, newsId }: UseEditorProps) => {
	const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);
	const editorRef = useRef<HTMLDivElement>(null);
	const { uploadImage } = useUploadImage();

	useEffect(() => {
		if (!editorRef.current) return;

		let editor: EditorJS | null = null;
		let isMounted = true;

		const initEditor = async () => {
			try {
				const [EditorJSClass] = await Promise.all([
					import('@editorjs/editorjs'),
				]);

				if (!isMounted || !editorRef.current) return;

				// Уничтожаем предыдущий экземпляр если есть
				if (editorInstance) {
					try {
						editorInstance.destroy();
					} catch (e) {
						console.warn('Ошибка при уничтожении редактора:', e);
					}
					setEditorInstance(null);
				}

				if (!isMounted || !editorRef.current) return;

				const tools = await createEditorTools(uploadImage);

				editor = new EditorJSClass.default({
					holder: editorRef.current,
					tools,
					data: initialData || EDITOR_DEFAULT_DATA,
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
	}, [newsId]);

	return {
		editorInstance,
		editorRef,
	};
};

