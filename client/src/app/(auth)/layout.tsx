import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Inter } from 'next/font/google';
import authenticate from '@/lib/auth/authenticate';
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

export default async function AuthRootLayout({
	children,
}: {
	children: React.ReactNode
}) {


	const cookiesStorage = cookies();
	const token = cookiesStorage.get('token')?.value;

	 const response = await authenticate(token as string);

	 if(response) {
	 redirect('/');
	 }
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
