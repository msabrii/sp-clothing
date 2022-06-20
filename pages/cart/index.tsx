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
			<div className="flex flex-col items-center w-full">
				<h1 className="mt-3">{cartPage.name}</h1>
				<div className="flex justify-center items-center border min-h-[400px] mt-5 w-[70%]">
					{cartItems ? cartItems.map((cartItem, idx) => <p key={idx}>{cartItem.item.name + ' ' + cartItem.size}</p>) : <p>Your Cart Is Empty</p>}
				</div>
			</div>
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
