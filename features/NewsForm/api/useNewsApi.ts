import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { INews } from '../../../types/News';

const API_BASE = '/api/news';

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.');
		// @ts-ignore
		error.info = await res.json();
		// @ts-ignore
		error.status = res.status;
		throw error;
	}
	return res.json();
};

const mutationFetcher = async (
	url: string,
	{ arg }: { arg: any }
) => {
	const method = arg.method || 'POST';
	const body = arg.body ? JSON.stringify(arg.body) : undefined;

	const res = await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	});

	if (!res.ok) {
		const error = new Error('An error occurred while mutating the data.');
		// @ts-ignore
		error.info = await res.json();
		// @ts-ignore
		error.status = res.status;
		throw error;
	}

	return res.json();
};

const uploadFetcher = async (url: string, { arg }: { arg: FormData }) => {
	const res = await fetch(url, {
		method: 'POST',
		body: arg,
	});

	if (!res.ok) {
		const error = new Error('An error occurred while uploading the file.');
		// @ts-ignore
		error.info = await res.json();
		// @ts-ignore
		error.status = res.status;
		throw error;
	}

	return res.json();
};

export const useNews = () => {
	const { data, error, isLoading, mutate } = useSWR<INews[]>(
		`${API_BASE}`,
		fetcher,
		{
			revalidateOnFocus: false,
		}
	);

	return {
		news: data || [],
		isLoading,
		isError: error,
		mutate,
	};
};

export const useCreateNews = () => {
	const { trigger, isMutating } = useSWRMutation(
		`${API_BASE}`,
		mutationFetcher
	);

	const createNews = async (data: Partial<INews>) => {
		return trigger({
			method: 'POST',
			body: data,
		});
	};

	return {
		createNews,
		isLoading: isMutating,
	};
};

export const useUpdateNews = () => {
	const { trigger, isMutating } = useSWRMutation(
		`${API_BASE}`,
		mutationFetcher
	);

	const updateNews = async (data: Partial<INews> & { _id: string }) => {
		return trigger({
			method: 'PUT',
			body: data,
		});
	};

	return {
		updateNews,
		isLoading: isMutating,
	};
};

export const useDeleteNews = () => {
	const { trigger, isMutating } = useSWRMutation(
		`${API_BASE}`,
		mutationFetcher
	);

	const deleteNews = async (id: string) => {
		const result = await trigger({
			method: 'DELETE',
			body: { id },
		});
		return result;
	};

	return {
		deleteNews,
		isLoading: isMutating,
	};
};

export const useUploadImage = () => {
	const { trigger, isMutating } = useSWRMutation(
		`${API_BASE}/upload`,
		uploadFetcher
	);

	const uploadImage = async (formData: FormData) => {
		return trigger(formData);
	};

	return {
		uploadImage,
		isLoading: isMutating,
	};
};

