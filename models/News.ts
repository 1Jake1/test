import { Schema, model, models } from 'mongoose';
import { INews } from '../types/News';

const NewsSchema = new Schema<INews>(
	{
		title: { type: String, required: true },
		content: { type: Schema.Types.Mixed, required: true }, // EditorJS output
		images: [{ type: String }], // Array of image URLs
		banner: { type: String }, // Banner image URL
		author: { type: String },
		published: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const News = models.News || model<INews>('News', NewsSchema);

