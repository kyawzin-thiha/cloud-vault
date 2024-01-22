'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './breadcrumbs.module.scss';
import Link from 'next/link';

export default function Breadcrumbs() {

	const [routes, setRoutes] = useState<{ name: string, path: string }[]>([{ name: 'Home', path: '/' }]);
	const params = useParams<{ folder: string[] }>();

	useEffect(() => {
		if (params?.folder) {
			const newRoutes = params.folder.map((folder, index) => {
				return {
					name: folder,
					path: `/${params.folder.slice(0, index + 1).join('/')}`,
				};
			});
			setRoutes([{ name: 'Home', path: '/' }, ...newRoutes]);
		}
	}, [params]);

	const breadcrumbs = [{ href: '/', label: 'Home' }, { href: '/', label: 'Home' }];

	return (
		<nav aria-label="breadcrumb">
			<ol className={styles.breadcrumbs}>
				{breadcrumbs.map((breadcrumb, index) => (
					<li key={index} className={styles.breadcrumbs__item}>
						{breadcrumb.href ? (
							<Link href={breadcrumb.href} className={styles.breadcrumbs__link}>
								{breadcrumb.label}
							</Link>
						) : (
							<span>{breadcrumb.label}</span>
						)}
						{index < breadcrumbs.length - 1 && (
							<span className={styles.breadcrumbs__separator}>/</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}