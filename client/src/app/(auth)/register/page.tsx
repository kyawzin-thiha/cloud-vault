'use client';

import { useState } from 'react';
import Link from 'next/link';
import register from '@/lib/auth/register';

import { AlertContainer } from '@/components/Dialogs/AlertContainer';
import styles from './register.module.scss';

interface Status {
	loading: boolean;
	success: boolean;
	message: string;
}

interface Response {
	loading: boolean;
	success: boolean;
	data: {
		message: string;
	};
}

export default function Page() {

	const [data, setData] = useState({ name: '', email: '' });
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [status, setStatus] = useState<Status>({ loading: false, success: true, message: '' });
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const toggleDialog = () => setDialogOpen(!isDialogOpen);
	const updateStatus = (update: Partial<Response>) => setStatus(prev => ({
		...prev,
		success: update.success || false,
		message: update.data?.message || '',
	}));

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		updateStatus({ loading: true });
		const response = await register(data.name, data.email);
		updateStatus({ loading: false, ...response });
		toggleDialog();
		setData({ name: '', email: '' });
	};

	return (
		<div className={styles['register-container']}>
			<div className={styles['title']}>
				<h2>
					Welcome to CloudVault
				</h2>
			</div>
			<form className={styles['form']} onSubmit={handleSubmit}>
				<div className={styles['description']}>
					Please enter your email and we&apos;ll send you a link to log you in securely. No password required.
				</div>
				<input type={'text'} name={'name'} className={styles['input']} autoFocus={true} placeholder={'Enter your' +
					' name'} value={data.name} onChange={handleChange} />
				<input type={'email'} name={'email'} className={styles['input']} placeholder={'Enter your email address'}
							 value={data.email} onChange={handleChange} />
				<button type={'submit'} className={styles['button']}>
					Register
				</button>
				<hr className={styles['divider']} />
				<Link href={'/login'} className={`${styles['button']} ${styles['login']}`}>
					<button type={'button'} className={`${styles['button']} ${styles['login']}`}>
						Login
					</button>
				</Link>
			</form>
			<AlertContainer isOpen={isDialogOpen} toggleDialog={toggleDialog}
											title={status.success ? 'Success' : 'Unexpected Error Occur'} message={status.message} />
		</div>
	);
}