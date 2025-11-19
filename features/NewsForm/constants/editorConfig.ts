import type EditorJS from '@editorjs/editorjs';

export const EDITOR_DEFAULT_DATA = {
	blocks: [],
	time: Date.now(),
	version: '2.28.2',
};

export const EDITOR_TOOLS_CONFIG = {
	header: {
		levels: [1, 2, 3, 4],
		defaultLevel: 2,
	},
	linkTool: {
		endpoint: '/api/news/link',
	},
};

export type EditorTools = {
	header: any;
	list: any;
	image: any;
	linkTool?: any;
	paragraph: any;
	quote: any;
	code: any;
	table: any;
	embed?: any;
};

export const createEditorTools = async (
	uploadImage: (formData: FormData) => Promise<{ url: string }>
): Promise<EditorTools> => {
	const [
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

	const tools: EditorTools = {
		header: {
			class: Header.default,
			config: EDITOR_TOOLS_CONFIG.header,
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
						const result = await uploadImage(formData);
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

	if (LinkTool?.default) {
		tools.linkTool = {
			class: LinkTool.default,
			config: EDITOR_TOOLS_CONFIG.linkTool,
		};
	}

	if (Embed?.default) {
		tools.embed = Embed.default;
	}

	return tools;
};

