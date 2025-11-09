'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog';
import {
	Table,
	TableBody,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/ui/table';
import { useGetUsersQuery } from '../../lib/store/userApi';
import { IUser } from '../../types/User';
import UserForm from '../UserForm/UserFrom';
import UserTableRow from './components/UserTableRow';

export default function UsersTable() {
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [open, setOpen] = useState(false);

	const { data: users = [] } = useGetUsersQuery();

	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<div className='flex justify-between mb-4 sm:flex-row flex-col'>
					<h2 className='text-xl font-semibold'>Список пользователей</h2>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setSelectedUser(null);
								setOpen(true);
							}}
						>
							Добавить пользователя
						</Button>
					</DialogTrigger>
				</div>
				<Table>
					<TableCaption>Все пользователи</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Логин</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Роль</TableHead>
							<TableHead>Департамент</TableHead>
							<TableHead className='text-right'>Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map(user => (
							<UserTableRow
								user={user}
								setOpen={setOpen}
								setSelectedUser={setSelectedUser}
								key={user._id}
							/>
						))}
					</TableBody>
				</Table>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedUser
								? 'Редактировать пользователя'
								: 'Создать пользователя'}
						</DialogTitle>
						<DialogDescription>
							{selectedUser
								? 'Измените данные пользователя и сохраните изменения.'
								: 'Введите данные нового пользователя.'}
						</DialogDescription>
					</DialogHeader>
					<UserForm
						user={selectedUser ?? undefined}
						onClose={() => setOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
