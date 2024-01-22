import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import { cookies } from 'next/headers';
import authenticate from '@/lib/auth/authenticate';
import { redirect } from 'next/navigation';
import getUser from '@/lib/user/getUser';
import NavBar from '@/components/Navigation/NavBar';
import Breadcrumbs from '@/components/Navigation/Breadcrumbs';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export const metadata: Metadata = {
  title: 'CloudVault',
  description: 'The only safe and secure way to keep your files safe.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookiesStorage = cookies();
  const token = cookiesStorage.get('token')?.value;

  const response = await authenticate(token);

  if (!response) {
    redirect('/login');
  }

  const user = await getUser(token as string);

  return (
    <html lang="en">
    <body className={inter.className}>
    <NavBar user={user} />
    <Breadcrumbs />
    {children}
    </body>
    </html>
  );
}
