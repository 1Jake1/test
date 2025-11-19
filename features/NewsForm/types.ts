import { INews } from '../../types/News';

export type INewsForm = Omit<INews, '_id' | 'createdAt' | 'updatedAt'>;

