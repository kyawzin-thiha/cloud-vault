'use server';

export default async function authenticate(token?: string) {
	if (!token) {
		return false;
	}

	const response = await fetch(`${process.env.API_URL}/user/authenticate`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `token=${token}`,
		},
		credentials: 'include',
		mode: 'cors',
		cache: 'no-cache',
	});
	return response.ok;
}