import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import './globals.scss';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export const metadata: Metadata = {
	title: 'CloudVault - Auth',
	description: 'The only safe and secure way to keep your files safe.',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
};

const authenticate = async (token: string) => {
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
};
export default async function AuthRootLayout({
	children,
}: {
	children: React.ReactNode
}) {


	const cookiesStorage = cookies();
	const token = cookiesStorage.get('token')?.value;
	/*
	 const response = await authenticate(token as string);

	 console.log(response);
	 if(response) {
	 redirect('/');
	 } */
	return (
		<html lang="en">
		<body className={inter.className}>
		<div className={'form-container'}>
			{children}
		</div>
		</body>
		</html>
	);
}
