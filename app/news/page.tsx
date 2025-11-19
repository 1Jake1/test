import NewsTable from '../../features/NewsTable/NewsTable';

export default async function NewsPage() {
	return (
		<div className='p-6 space-y-8'>
			<h1 className='text-2xl font-bold'>Управление новостями</h1>
			<NewsTable />
		</div>
	);
}

