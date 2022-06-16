import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				</Head>
				<body className="overflow-x-hidden font-display">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
