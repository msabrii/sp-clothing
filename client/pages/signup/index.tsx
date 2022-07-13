import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layout/Layout';

const Signup = () => {
	// const { signUp } = useContext(AuthContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
		// signUp(email, password);
	};

	return (
		<Layout seo={{ metaTitle: 'Login - SP', metaDescription: 'This is the login/signup page' }}>
			<div className="flex flex-col items-center justify-center">
				<div className="w-[500px] flex flex-col">
					<form onSubmit={handleSubmit} className="flex flex-col mt-5">
						<label htmlFor="email">Email</label>
						<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password">Password</label>
						<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<button type="submit">Sign up</button>
					</form>
					<Link href="/login">If you already have an account, Login</Link>
				</div>
			</div>
		</Layout>
	);
};

export default Signup;
