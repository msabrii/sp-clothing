import { useContext } from 'react';
import CartItem from '../../components/CartItem/CartItem';
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
				<div className={`flex justify-center items-center ${!cartItems && 'border'} min-h-[400px] mt-5 min-w-[700px]`}>
					{cartItems ? (
						<ul className="w-full">
							{cartItems.map((cartItem, idx) => (
								<CartItem key={idx} item={cartItem.item} size={cartItem.size} />
							))}
						</ul>
					) : (
						<>
							<p>Your Cart Is Empty</p>
						</>
					)}
				</div>
				{cartItems && (
					<div className="flex flex-row items-center justify-between w-[700px]">
						<p>Total</p>
						<p>£500</p>
					</div>
				)}
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
