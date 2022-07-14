import React, { createContext, useState } from 'react';
import { AuthApi, Configuration } from '../api';

interface Props {
	children: React.ReactNode;
}

interface AuthInterface {
	user: any;
	signIn: (username: string, password: string) => void;
	signUp: (username: string, password: string) => void;
	signInWithCode: (code: string) => void;
	signOut: () => void;
	signInWithGoogle: () => void;
}

export const AuthContext = createContext<AuthInterface>({} as AuthInterface);

const AuthContextProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<any | undefined>();

	const api = new AuthApi(new Configuration());

	// useEffect(() => {
	// 	checkUser();
	// }, []);

	const signInWithGoogle = async () => {
		try {
			const user = await api.signInGoogleGet('client');
			console.log(user);
			window.open(user!.data!, '_blank', 'popup,height=600,width=500,left=400,top=200');
		} catch (error) {
			console.log(error);
		}
	};

	const signIn = async (username: string, password: string) => {
		try {
			const user = await api.signInPost({ email: username, password });
			console.log(user);
			setUser(user.data);
		} catch (error) {
			console.log(error);
		}
	};

	const signInWithCode = async (code: string) => {
		try {
			const res = await api.signInWithCodePost({ code, target: 'client' });
			// localStorage.removeItem('loginCode');
			console.log(res);
			if (!res) return;
			localStorage.setItem('accessToken', res.data.access_token);
			localStorage.setItem('idToken', res.data.id_token);
			localStorage.setItem('refreshToken', res.data.refresh_token);
		} catch (error) {
			console.log(error);
		}
	};

	const signUp = async (username: string, password: string) => {
		try {
			const user = await api.signUpPost({ email: username, password });
			console.log(user);
			setUser(user);
			// const confirm = await Auth.confirmSignUp(username, password);
			console.log(confirm);
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = async () => {
		await api.signOutPost(
			{},
			{
				headers: {
					Authorization: `Bearer ${user.AccessToken}`,
				},
			}
		);
		setUser(undefined);
	};

	// const checkUser = async () => {
	// 	try {
	// 		const user = await Auth.currentAuthenticatedUser();
	// 		setUser(user);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				signUp,
				signInWithGoogle,
				signInWithCode,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
