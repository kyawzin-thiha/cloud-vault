'use server';

import { cookies } from 'next/headers';

export async function createNewFolder(currentDirectory: string, name: string) {

	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	try {
		const response = await fetch(`${process.env.API_URL}/storage/create-folder`, {
			method: 'POST',
			headers: {
				Cookie: `token=${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				folder: currentDirectory,
				name,
			}),
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
		});

		return {
			success: response.ok,
			data: response.ok ? { message: 'New Folder Created' } : await response.json(),
		};
	} catch (error) {
		return {
			success: false,
			data: {
				message: 'Something went wrong. Please try again later.',
			},
		};
	}
}

export async function getNames(folders: string[]) {

	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	try {
		const response = await fetch(`${process.env.API_URL}/storage/get-names`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `token=${token}`,
			},
			body: JSON.stringify({
				folders,
			}),
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
		});

		return {
			success: response.ok,
			data: response.ok ? await response.json() : null,
		};
	} catch (error) {
		return {
			success: false,
			data: null,
		};
	}
}