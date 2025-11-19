export interface INews {
	_id?: string;
	title: string;
	content?: any; // EditorJS output data
	images?: string[]; // Array of image URLs
	author?: string;
	published?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

