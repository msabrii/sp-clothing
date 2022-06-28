import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useContext } from 'react';
import { OpenAPI, SpClothingAPI } from '../../api';
import { CartContext } from '../../context/CartContext';

export const PaymentsForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const { cartItems } = useContext(CartContext);

	const api = new SpClothingAPI(OpenAPI);

	const CARD_OPTIONS = {
		style: {
			base: {
				color: '#32325d',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4',
				},
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a',
			},
		},
	};
	console.log(cartItems);

	const calculateTotal = () => cartItems!.reduce((total, curr) => (total += curr.item.price), 0);

	const handlePayment = async (e: any) => {
		e.preventDefault();
		const { error, paymentMethod } = await stripe!.createPaymentMethod({
			type: 'card',
			card: elements!.getElement(CardElement)!,
		});

		const total = calculateTotal();

		if (!error) {
			try {
				const { id } = paymentMethod;
				const response = await api.default.postPayment({
					amount: total * 100,
					id,
				});
				// const response = await fetch('https://lkcayvfz2k.execute-api.eu-west-1.amazonaws.com/dev/payment', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 	},
				// body: JSON.stringify({
				// 	amount: total * 100,
				// 	id,
				// }),
				// });
				console.log(response);

				if (response.success) console.log('success!!');
			} catch (e) {
				console.log('Error', e);
			}
		} else {
			console.log(error.message);
		}
	};

	return (
		<form onSubmit={handlePayment} className="w-[700px]">
			<fieldset className="FormGroup">
				<div className="FormRow">
					<CardElement options={CARD_OPTIONS} />
				</div>
			</fieldset>
			<button>Pay</button>
		</form>
	);
};
