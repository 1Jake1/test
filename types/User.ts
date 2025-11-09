export type UserRole = 'admin' | 'manager' | 'employee';
export interface IUser {
	_id?: string;
	login: string;
	email: string;
	role: UserRole;
	department: string;
	createdAt?: Date;
	updatedAt?: Date;
}
