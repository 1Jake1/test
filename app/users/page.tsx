import UsersTable from '../../features/UserTable/UserTable';

export default async function UsersPage() {
	return (
		<div className='p-6 space-y-8'>
			<h1 className='text-2xl font-bold'>Управление пользователями</h1>
			<UsersTable />
		</div>
	);
}
