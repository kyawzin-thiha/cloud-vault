'use server';

import { cookies } from 'next/headers';

export default async function logout() {

	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;

	try {
		const response = await fetch(`${process.env.API_URL}/user/logout`, {
			method: 'GET',
			headers: {
				Cookie: `token=${token}`,
			},
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
		});

		return {
			success: response.ok,
			data: '',
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			data: {
				message: 'Something went wrong. Please try again later.',
			},
		};
	}
}