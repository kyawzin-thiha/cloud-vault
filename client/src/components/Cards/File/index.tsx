'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import FileIcon from '@/assets/svgs/file.svg';
import styles from './file.module.scss';

export interface FileFolder {
	id: string;
	name: string;
	type: 'FILE' | 'FOLDER';
	path: string;
	parentId: string | null;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

export default function FileCard({ file }: { file: FileFolder }) {

	const currentPath = usePathname();

	return (
		<a href={file.path} target="_blank" rel="noopener noreferrer" className={styles['file-card']}>
			<div className={styles['icon']}>
				<Image src={FileIcon} alt="File Icon" width={45} height={45} />
			</div>
			<div className={styles['name']}>{file.name}</div>
		</a>
	);
}