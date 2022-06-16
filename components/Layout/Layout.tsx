import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import meta from '../../meta.config';
import NavBar from '../NavBar/NavBar';

const Layout: React.FC<{ children: React.ReactNode; seo?: any }> = ({ children, seo }) => {
	const router = useRouter();
	let pageUrl = seo?.canonicalUrl ? seo.canonicalUrl : router.asPath;
	pageUrl = pageUrl.replace(/\/?$/, '/');
	const canonicalUrl = `https://sp-clothing.com${pageUrl}`;
	return (
		<>
			{seo && (
				<Head>
					<meta name="robots" content="follow, index" />
					<meta property="og:site_name" content={meta.openGraph.site_name} />
					<meta property="og:locale" content="en-GB" />
					<meta property="og:type" content="website" />
					<title>{seo.title || meta.title}</title>
					<meta content={seo.description || meta.description} name="description" />
					<meta property="og:title" content={seo.title || `${meta.title} | SP-Clothing`} />
					<meta property="og:description" content={seo.description || meta.description} />
					<meta property="og:url" content={canonicalUrl} />
					<link rel="canonical" href={canonicalUrl} />
					{/* {seo.openGraphCollection &&
						seo.openGraphCollection.items.map((item, index) => {
							return <meta property={item.key} key={`seo-tag-${index}`} content={item.value} />;
						})} */}
				</Head>
			)}
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
