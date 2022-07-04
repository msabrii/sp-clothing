import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import AuthContextProvider from '../context/AuthContext';
import { CartContextProvider } from '../context/CartContext';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthContextProvider>
			<CartContextProvider>
				<Component {...pageProps} />
			</CartContextProvider>
		</AuthContextProvider>
	);
}

export default MyApp;
