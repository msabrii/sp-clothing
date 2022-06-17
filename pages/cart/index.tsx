import Layout from '../../components/Layout/Layout';
import ContentfulApi from '../../utils/ContentfulApi';
import { Page } from '../../utils/interfaces';

interface Props {
	cartPage: Page;
}

const cart: React.FC<Props> = ({ cartPage }) => {
	return (
		<Layout seo={cartPage.seo}>
			<h1>{cartPage.name}</h1>
		</Layout>
	);
};

export default cart;

export async function getStaticProps() {
	const cartPage = await ContentfulApi.getPageBySlug('cart');

	// Add this with fallback: "blocking"
	// So that if we do not have a cartPage on production,
	// the 404 is served
	if (!cartPage) {
		return {
			notFound: true,
		};
	}
	return { props: { cartPage } };
}