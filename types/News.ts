export interface INews {
	_id?: string;
	title: string;
	content?: any; // EditorJS output data
	images?: string[]; // Array of image URLs
	banner?: string; // Banner image URL
	author?: string;
	published?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

