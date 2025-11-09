'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import { mixed, object, ObjectSchema, string } from 'yup';
import { Button } from '../../components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select';
import {
	useCreateUserMutation,
	useUpdateUserMutation,
} from '../../lib/store/userApi';
import { IUser, UserRole } from '../../types/User';
import { IUserForm } from './types';

export const schema: ObjectSchema<IUserForm> = object({
	login: string().required('Введите логин'),
	email: string().email('Некорректный email').required('Введите email'),
	role: mixed<UserRole>()
		.oneOf(['admin', 'employee'])
		.required('Выберите роль'),
	department: string().required('Введите департамент'),
});

export default function UserForm({
	user,
	onClose,
}: {
	user?: IUser;
	onClose?: () => void;
}) {
	const form = useForm<IUser>({
		resolver: yupResolver(schema),
		defaultValues: user ?? {
			login: '',
			email: '',
			role: 'employee',
			department: '',
		},
	});

	const [createUser] = useCreateUserMutation();
	const [updateUser] = useUpdateUserMutation();

	const onSubmit: SubmitHandler<IUser> = async values => {
		if (user?._id) {
			await updateUser({ ...values, _id: user._id });
		} else {
			await createUser(values);
		}
		onClose?.();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='login'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Логин</FormLabel>
							<FormControl>
								<Input placeholder='ivanov' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type='email' placeholder='user@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='role'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Роль</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Выберите роль' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='admin'>Администратор</SelectItem>
									<SelectItem value='employee'>Сотрудник</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='department'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Департамент</FormLabel>
							<FormControl>
								<Input placeholder='IT, HR...' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					{user ? 'Обновить' : 'Создать'}
				</Button>
			</form>
		</Form>
	);
}
