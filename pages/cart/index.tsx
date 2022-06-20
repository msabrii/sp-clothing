import { useContext } from 'react';
import Layout from '../../components/Layout/Layout';
import { CartContext } from '../../context/CartContext';
import ContentfulApi from '../../utils/ContentfulApi';
import { Page } from '../../utils/interfaces';

interface Props {
	cartPage: Page;
}

const Cart: React.FC<Props> = ({ cartPage }) => {
	const { cartItems } = useContext(CartContext);
	return (
		<Layout seo={cartPage.seo}>
			<h1>{cartPage.name}</h1>
			{cartItems && cartItems.map((cartItem, idx) => <p key={idx}>{cartItem.item.name}</p>)}
		</Layout>
	);
};

export default Cart;

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
