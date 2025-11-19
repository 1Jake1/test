import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INews } from '../../types/News';

export const newsApi = createApi({
	reducerPath: 'newsApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	tagTypes: ['News'],
	endpoints: build => ({
		getNews: build.query<INews[], void>({
			query: () => '/news',
			providesTags: ['News'],
		}),
		createNews: build.mutation<INews, Partial<INews>>({
			query: body => ({
				url: '/news',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['News'],
		}),
		updateNews: build.mutation<INews, Partial<INews>>({
			query: body => ({
				url: '/news',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['News'],
		}),
		deleteNews: build.mutation<{ success: boolean }, string>({
			query: id => ({
				url: '/news',
				method: 'DELETE',
				body: { id },
			}),
			invalidatesTags: ['News'],
		}),
		uploadImage: build.mutation<{ url: string }, FormData>({
			query: formData => ({
				url: '/news/upload',
				method: 'POST',
				body: formData,
			}),
		}),
	}),
});

export const {
	useGetNewsQuery,
	useCreateNewsMutation,
	useUpdateNewsMutation,
	useDeleteNewsMutation,
	useUploadImageMutation,
} = newsApi;

