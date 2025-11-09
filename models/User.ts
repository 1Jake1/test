import { Schema, model, models } from 'mongoose';
import { IUser } from '../types/User';

const UserSchema = new Schema<IUser>(
	{
		login: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		role: {
			type: String,
			enum: ['admin', 'employee'],
			required: true,
		},
		department: { type: String, required: true },
	},
	{ timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);
