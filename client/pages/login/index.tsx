import Link from 'next/link';
import { useContext, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
	const { signIn, user, signOut, signInWithGoogle } = useContext(AuthContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
		signIn(email, password);
	};

	return (
		<Layout seo={{ metaTitle: 'Login - SP', metaDescription: 'This is the login/signup page' }}>
			<div className="flex flex-col items-center justify-center">
				<div className="w-[500px] flex flex-col">
					{user && <p>{user.username}</p>}
					<form onSubmit={handleSubmit} className="flex flex-col mt-5">
						<label htmlFor="email">Email</label>
						<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password">Password</label>
						<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<button type="submit">Login</button>
					</form>
					<button onClick={signInWithGoogle}>Sign In With Google</button>
					<Link href="/signup">Sign up</Link>
				</div>
			</div>
		</Layout>
	);
};

export default Login;
