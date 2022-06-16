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

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const page = await ContentfulApi.getPageBySlug(params!.slug![0]);

	// Add this with fallback: "blocking"
	// So that if we do not have a post on production,
	// the 404 is served
	if (!page) {
		return {
			notFound: true,
		};
	}
	return { props: { page } };
};

export const getStaticPaths: GetStaticPaths = async () => {
	const pagesCollection = await ContentfulApi.getAllPages();
	return { paths: pagesCollection?.map((page: { slug: string }) => `/${page.slug}`) ?? [], fallback: false };
};
