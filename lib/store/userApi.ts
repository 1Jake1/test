import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../../types/User';

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	tagTypes: ['Users'],
	endpoints: build => ({
		getUsers: build.query<IUser[], void>({
			query: () => '/users',
			providesTags: ['Users'],
		}),
		createUser: build.mutation<IUser, Partial<IUser>>({
			query: body => ({
				url: '/users',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Users'],
		}),
		updateUser: build.mutation<IUser, Partial<IUser>>({
			query: body => ({
				url: '/users',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['Users'],
		}),
		deleteUser: build.mutation<{ success: boolean }, string>({
			query: id => ({
				url: '/users',
				method: 'DELETE',
				body: { id },
			}),
			invalidatesTags: ['Users'],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = userApi;
