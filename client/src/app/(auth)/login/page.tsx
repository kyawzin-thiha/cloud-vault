'use client';

import { useState } from 'react';
import Link from 'next/link';
import login from '@/lib/auth/login';
import { AlertContainer } from '@/components/Dialogs/AlertContainer';
import styles from './login.module.scss';

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
	const [email, setEmail] = useState('');
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [status, setStatus] = useState<Status>({ loading: false, success: true, message: '' });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
	const toggleDialog = () => setDialogOpen(!isDialogOpen);
	const updateStatus = (update: Partial<Response>) => setStatus(prev => ({
		...prev,
		success: update.success || false,
		message: update.data?.message || '',
	}));

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateStatus({ loading: true });
		const response = await login(email);
		updateStatus({ loading: false, ...response });
		toggleDialog();
		console.log(status);
		setEmail('');
	};

	return (
		<div className={styles['login-container']}>
			<div className={styles['title']}>
				<h2>
					Welcome to CloudVaults
				</h2>
			</div>
			<form className={styles['form']} onSubmit={handleSubmit}>
				<div className={styles['description']}>
					Please enter your email and we&apos;ll send you a link to log you in securely.
				</div>
				<input type={'email'} name={'email'} required={true} className={styles['input']} autoFocus={true}
							 value={email}
							 onChange={handleChange}
							 placeholder={'Enter your email address'} />
				<button type={'submit'} className={styles['button']}>
					Log Me In
				</button>
				<hr className={styles['divider']} />
				<Link href={'/register'} className={`${styles['button']} ${styles['register']}`}>
					<button type={'button'} className={`${styles['button']} ${styles['register']}`}>
						Register
					</button>
				</Link>
			</form>
			<AlertContainer isOpen={isDialogOpen} toggleDialog={toggleDialog}
											title={status.success ? 'Success' : 'Unexpected Error Occur'} message={status.message} />
		</div>
	);
}