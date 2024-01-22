import { getChildren } from '@/lib/storage/file';
import List from '@/components/Cards/List';
import FolderCard from '@/components/Cards/Folder';
import FileCard from '@/components/Cards/File';

export default async function Page({ params }: { params: { folder: string[] } }) {
	const currentFolder = params.folder[params.folder.length - 1];

	const { success, data } = await getChildren(currentFolder);

	return (
		<main>
			<List>
				{data.map((item: any) => {
					if (item.type === 'FOLDER') {
						return <FolderCard key={item.id} folder={item} />;
					}
					else {
						return <FileCard key={item.id} file={item} />;
					}
				})}
			</List>
		</main>
	);
}