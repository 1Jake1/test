import { IUser } from '../../types/User';

export type IUserForm = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;
