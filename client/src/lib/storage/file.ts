'use server';

import { cookies } from 'next/headers';


export async function uploadNewFile(formData: FormData) {

	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	try {
		const response = await fetch(`${process.env.API_URL}/storage/create-file`, {
			method: 'POST',
			headers: {
				Cookie: `token=${token}`,
			},
			body: formData,
			credentials: 'include',
			mode: 'cors',
			cache: 'no-cache',
		});

		return {
			success: response.ok,
			data: await response.json(),
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

export async function getAll() {

	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	try {
		const response = await fetch(`${process.env.API_URL}/storage/get-all`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `token=${token}`,
			},
			credentials: 'include',
			mode: 'cors',
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


export async function getChildren(folder: string) {

	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	try {
		const response = await fetch(`${process.env.API_URL}/storage/${folder}/children`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `token=${token}`,
			},
			credentials: 'include',
			mode: 'cors',
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