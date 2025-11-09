import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { TableCell, TableRow } from '../../../components/ui/table';
import { useDeleteUserMutation } from '../../../lib/store/userApi';
import { IUser } from '../../../types/User';

interface UserTableRowProps {
	user: IUser;
	setSelectedUser: (user: IUser) => void;
	setOpen: (isOpen: boolean) => void;
}

export default function UserTableRow({
	user,
	setSelectedUser,
	setOpen,
}: UserTableRowProps) {
	const [deleteUser] = useDeleteUserMutation();

	return (
		<TableRow key={user._id}>
			<TableCell>{user.login}</TableCell>
			<TableCell>{user.email}</TableCell>
			<TableCell>{user.role}</TableCell>
			<TableCell>{user.department}</TableCell>
			<TableCell className='text-right'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<MoreVertical className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem
							onClick={() => {
								setSelectedUser(user);
								setOpen(true);
							}}
						>
							<Pencil className='h-4 w-4 mr-2' />
							Редактировать
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-destructive focus:text-destructive'
							onClick={() => deleteUser(user._id!)}
						>
							<Trash2 className='h-4 w-4 mr-2' />
							Удалить
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
