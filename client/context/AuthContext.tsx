import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import { Amplify, Auth } from 'aws-amplify';
import React, { createContext, useEffect, useState } from 'react';
import config from '../auth-config.json';

Amplify.configure(config);
interface Props {
	children: React.ReactNode;
}

interface AuthInterface {
	user: any;
	signIn: (username: string, password: string) => void;
	signUp: (username: string, password: string) => void;
	signOut: () => void;
	signInWithGoogle: () => void;
}

export const AuthContext = createContext<AuthInterface>({} as AuthInterface);

const AuthContextProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<any | undefined>();

	useEffect(() => {
		checkUser();
	}, []);

	const signInWithGoogle = async () => {
		try {
			const user = await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
			setUser(user);
		} catch (error) {
			console.log(error);
		}
	};

	const signIn = async (username: string, password: string) => {
		try {
			const user = await Auth.signIn(username, password);
			setUser(user);
		} catch (error) {
			console.log(error);
		}
	};

	const signUp = async (username: string, password: string) => {
		try {
			const test = await Auth.signUp(username, password);
			console.log(test);
			setUser(test);
			// const confirm = await Auth.confirmSignUp(username, password);
			console.log(confirm);
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = async () => {
		await Auth.signOut();
		setUser(undefined);
	};

	const checkUser = async () => {
		try {
			const user = await Auth.currentAuthenticatedUser();
			setUser(user);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				signUp,
				signInWithGoogle,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
