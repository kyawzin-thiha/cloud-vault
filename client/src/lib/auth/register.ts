'use server';
export default async function register(name: string, email: string) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email }),
			mode: 'cors',
			credentials: 'include',
			cache: 'no-cache',
		});

		return {
			success: response.ok,
			status: response.status,
			data: response.ok ? { message: 'We\'ve created an account for you. You can now use your email to login' } : await response.json(),
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