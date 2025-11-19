'use client';

interface EditorProps {
	editorRef: React.RefObject<HTMLDivElement>;
}

export default function Editor({ editorRef }: EditorProps) {
	return (
		<div
			ref={editorRef}
			className='min-h-[300px] border rounded-md p-4'
		/>
	);
}

