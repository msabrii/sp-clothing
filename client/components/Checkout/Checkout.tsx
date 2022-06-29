import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentsForm } from '../PaymentsForm/PaymentsForm';

const stripeTestPromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Checkout = () => {
	return (
		<div className="flex flex-col justify-center items-center min-h-[600px]">
			<Elements stripe={stripeTestPromise}>
				<PaymentsForm />
			</Elements>
		</div>
	);
};

export default Checkout;
