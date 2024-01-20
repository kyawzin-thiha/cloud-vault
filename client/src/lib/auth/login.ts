'use server';

export default async function login(email: string) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
		});

		return {
			success: response.ok,
			status: response.status,
			data: response.ok ? { message: 'We\'ve send you a link to log you in securely. Please check your email.' } : await response.json(),
		};

	} catch (error) {
		return {
			success: false,
			status: 500,
			data: {
				message: 'Something went wrong. Please try again later.',
			},
		};
	}
}