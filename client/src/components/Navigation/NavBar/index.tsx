'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Logo from '@/assets/svgs/logo.svg';
import styles from './navbar.module.scss';
import { createNewFolder } from '@/lib/storage/folder';
import { uploadNewFile } from '@/lib/storage/file';

type User = {
	id: string;
	name: string;
	email: string;
	profile: string;
}

export default function NavBar({ user }: { user: User }) {
	return (
		<nav className={styles['nav']}>
			<div className={styles['logo']}>
				<Image src={Logo} alt={'logo'} fill={true} />
			</div>
			<AvatarMenu user={user} />
		</nav>
	);
}


const AvatarMenu = ({ user }: { user: User }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [type, setType] = useState<'file' | 'folder' | ''>('');

	const handleOpen = (type: 'file' | 'folder') => {
		setIsOpen(true);
		setType(type);
	};
	const handleClose = () => {
		setIsOpen(false);
		setType('');
	};

	const handleDialog = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleDialog}>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage
								src={'https://pub-62ea6fadbade4a339c4b4bba374a6ec0.r2.dev/CloudVault/up2119714@myport.ac.uk-avatar.svg'} />
							<AvatarFallback>{user.name}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align={'end'} className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<DialogTrigger onClick={() => handleOpen('file')}>
								Upload New File
							</DialogTrigger>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<DialogTrigger onClick={() => handleOpen('folder')}>
								Create New Folder
							</DialogTrigger>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Log Out</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<DialogContent className="sm:max-w-[425px]">
					{
						type === 'file' ? <UploadFile handleClose={handleClose} /> :
							type === 'folder' ? <UploadFolder handleClose={handleClose} /> : null
					}
				</DialogContent>
			</Dialog>
		</>
	);
};


const UploadFolder = ({ handleClose }: { handleClose: () => void }) => {

	const params = useParams<{ folder: string[] }>();
	const currentDirectory = params.folder ? params.folder[params.folder.length - 1] : '';
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const formJson = Object.fromEntries((formData as any).entries());
		const folderName = formJson.name;

		const response = await createNewFolder(currentDirectory, folderName);
		if (response.success) {
			router.refresh();
			handleClose();
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Upload New Folder</DialogTitle>
				<DialogDescription>
					Ender the name of the folder you want to create.
				</DialogDescription>
			</DialogHeader>
			<form onSubmit={handleSubmit}>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input id="name" name="name" required={true} placeholder={'Folder Name'} className="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</form>
		</>
	);
};

const UploadFile = ({ handleClose }: { handleClose: () => void }) => {


	const params = useParams<{ folder: string[] }>();
	const currentDirectory = params.folder ? params.folder[params.folder.length - 1] : '';
	const router = useRouter();


	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		maxFiles: 1,
	});

	const files = acceptedFiles.map((file: any) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (acceptedFiles.length === 0) return;
		const formData = new FormData();
		formData.append('file', acceptedFiles[0]);
		formData.append('folder', currentDirectory);
		const response = await uploadNewFile(formData);

		if (response.success) {
			router.refresh();
			handleClose();
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Upload New File</DialogTitle>
				<DialogDescription>
					Select the file you want to upload or drag and drop it here.
				</DialogDescription>
			</DialogHeader>
			<form onSubmit={handleSubmit}>
				<section className={styles['dropzone-container']}>
					<div {...getRootProps({
						className: `${styles['dropzone']} 
                          ${isDragActive ? 'isDragActive' : ''} 
                          ${isDragAccept ? 'isDragAccept' : ''} 
                          ${isDragReject ? 'isDragReject' : ''}`,
					})}>
						<input {...getInputProps()} />
						<p>Drag n drop some files here, or click to select files</p>
					</div>
					<aside>
						<h4>Files</h4>
						<ul>{files}</ul>
					</aside>
				</section>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</form>
		</>
	);
};