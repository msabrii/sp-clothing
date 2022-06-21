import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import Layout from '../components/Layout/Layout';
import ContentfulApi from '../utils/ContentfulApi';
import { SEO } from '../utils/interfaces';

interface IPage {
	page: {
		slug: string;
		name: string;
		seo: SEO;
	};
}

const Page: FC<IPage> = ({ page }) => {
	// const router = useRouter();
	// const slug = router.query.slug || [];

	return (
		<Layout seo={page.seo}>
			<h1>{page.name}</h1>
		</Layout>
	);
};

export default Page;

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
	const page = await ContentfulApi.getPageBySlug(params!.slug![0], locale!, params!.locales! as string[]);

	// Add this with fallback: "blocking"
	// So that if we do not have a page on production,
	// the 404 is served
	if (!page) {
		return {
			notFound: true,
		};
	}
	return { props: { page } };
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const customPages = ['cart', 'products'];

	const localePaths = locales!.flatMap(async (locale) => {
		const pageCollection = await ContentfulApi.getAllPages(false, locale);

		return pageCollection.items
			.filter((page: any) => {
				if (customPages.includes(page.slug)) return false;
				return true;
			})
			.map((page: any) => {
				// let slugs = page.seo.canonicalUrl.split('/');
				// slugs = slugs.filter((obj: any) => obj !== '');

				return {
					params: { slug: `/${page.slug}`, locales },
					locale: locale,
				};
			});
	});

	let paths = await Promise.all(localePaths).then((values) => {
		return values;
	});

	// const pagesCollection = await ContentfulApi.getAllPages();
	// const filterPages = pagesCollection.filter((page: any) => !customPages.includes(page.slug));
	// const paths = filterPages?.map((page: { slug: string }) => `/${page.slug}`) ?? [];
	return { paths: paths.flat(), fallback: false };
};
