'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './breadcrumbs.module.scss';
import Link from 'next/link';

const getNames = async (folders: string[]) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/get-names`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			folders,
		}),
		mode: 'cors',
		credentials: 'include',
		cache: 'no-cache',
	});

	return await response.json();
};

export default function Breadcrumbs() {

	const [routes, setRoutes] = useState<{ name: string, path: string }[]>([{ name: 'Home', path: '/' }]);
	const params = useParams<{ folder: string[] }>();
	useEffect(() => {
		const assignNames = async () => {
			if (params?.folder) {
				const names = await getNames(params.folder);
				const newRoutes = names.map((item: any, index: number) => {
					return {
						name: item.name,
						path: `/${names.slice(0, index + 1).map((x: any) => x.id).join('/')}`,
					};
				});
				setRoutes([{ name: 'Home', path: '/' }, ...newRoutes]);
			}
			else {
				setRoutes([{ name: 'Home', path: '/' }]);
			}
		};
		assignNames();
	}, [params]);

	const breadcrumbs = [{ href: '/', label: 'Home' }, { href: '/', label: 'Home' }];

	return (
		<nav aria-label="breadcrumb">
			<ol className={styles.breadcrumbs}>
				{routes.map((breadcrumb, index) => (
					<li key={index} className={styles.breadcrumbs__item}>
						{breadcrumb.path ? (
							<Link href={breadcrumb.path} className={styles.breadcrumbs__link}>
								{breadcrumb.name}
								<span className={styles.breadcrumbs__separator}>/</span>
							</Link>
						) : (
							<span>{breadcrumb.name}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}