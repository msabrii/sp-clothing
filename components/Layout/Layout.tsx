import Image from 'next/image';
import React from 'react';
import NavBar from '../NavBar/NavBar';
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<NavBar />
			<div className="wrapper">{children}</div>
			<footer className="wrapper text-center">
				<a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
					Powered by{' '}
					<span>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</>
	);
};

export default Layout;
