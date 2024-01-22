'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FolderIcon from '@/assets/svgs/folder.svg';
import styles from './folder.module.scss';

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

export default function FolderCard({ folder }: { folder: FileFolder }) {

	const currentPath = usePathname();

	return (
		<Link href={`${currentPath !== '/' ? currentPath : ''}/${folder.id}`} passHref className={styles['folder-card']}>
			<div className={styles['icon']}>
				<Image src={FolderIcon} alt="Folder Icon" width={45} height={45} />
			</div>
			<div className={styles['name']}>{folder.name}</div>
		</Link>
	);
}