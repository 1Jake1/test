import { IUser } from '../types/User';

export async function createUser(data: IUser) {
	const res = await fetch(`/api/users`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});
	return res.json();
}

export async function updateUser(data: IUser) {
	const res = await fetch(`/api/users`, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});
	return res.json();
}

export async function deleteUser(id: string) {
	await fetch(`/api/users`, {
		method: 'DELETE',
		body: JSON.stringify({ id }),
		headers: { 'Content-Type': 'application/json' },
	});
}
