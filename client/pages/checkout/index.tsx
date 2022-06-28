import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '../../components/Layout/Layout';
import { PaymentsForm } from '../../components/PaymentsForm/PaymentsForm';

const stripeTestPromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
const Checkout = () => {
	return (
		<Layout seo={{ metaTitle: 'Checkout - SP', metaDescription: 'Checkout with SP' }}>
			<div className="flex flex-col justify-center items-center min-h-[600px]">
				<Elements stripe={stripeTestPromise}>
					<PaymentsForm />
				</Elements>
			</div>
		</Layout>
	);
};

export default Checkout;
