import Link from 'next/link';
import { useContext, useState } from 'react';
import CartItem from '../../components/CartItem/CartItem';
import Layout from '../../components/Layout/Layout';
import { CartContext } from '../../context/CartContext';
import ContentfulApi from '../../utils/ContentfulApi';
import { Page } from '../../utils/interfaces';
import Checkout from '../../components/Checkout/Checkout';
interface Props {
	cartPage: Page;
}

const Cart: React.FC<Props> = ({ cartPage }) => {
	const { cartItems } = useContext(CartContext);
	const [checkout, setCheckout] = useState(false);

	const calculateTotal = () => cartItems!.reduce((total, curr) => (total += curr.item.price), 0);

	return (
		<Layout seo={cartPage.seo}>
			<div className="flex flex-col items-center w-full">
				<h1 className="mt-3">{cartPage.name}</h1>

				{!checkout && (
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
				)}
				{cartItems && !checkout ? (
					<>
						<div className="flex flex-row items-center justify-between w-[700px]">
							<p>Total</p>
							<p>£{calculateTotal()}</p>
						</div>

						<button className="w-[700px] bg-black text-white p-2 mt-3 rounded-md" onClick={() => setCheckout(true)}>
							Checkout
						</button>
					</>
				) : (
					<Checkout />
				)}
			</div>
		</Layout>
	);
};

export default Cart;

export async function getStaticProps(props: { locale: any }) {
	const cartPage = await ContentfulApi.getPageBySlug('cart', props.locale);

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
