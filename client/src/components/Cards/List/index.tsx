import styles from './list.module.scss';

export default function List({ children }: { children: React.ReactNode[] }) {
	return (
		<div className={styles.grid}>
			{children}
		</div>
	);
}