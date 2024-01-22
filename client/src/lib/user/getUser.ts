export default async function getUser(token: string) {
	const response = await fetch(`${process.env.API_URL}/user`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `token=${token}`,
		},
		credentials: 'include',
		mode: 'cors',
		cache: 'no-cache',
	});
	if (response.ok) {
		return await response.json();
	}
	return null;
}