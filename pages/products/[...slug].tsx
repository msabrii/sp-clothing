import { useRouter } from 'next/router';
import ContentfulApi from '../../utils/ContentfulApi';

const ProductDetails = ({ product }) => {
	const router = useRouter();
	const slug = router.query.slug || [];

	console.log(product);

	return (
		<>
			<h1>{slug}</h1>
		</>
	);
};

export default ProductDetails;

export async function getStaticProps({ params }) {
	const product = await ContentfulApi.getProductBySlug(params.slug);

	// Add this with fallback: "blocking"
	// So that if we do not have a post on production,
	// the 404 is served
	if (!product) {
		return {
			notFound: true,
		};
	}
	return { props: { product } };
}

export async function getStaticPaths() {
	const productsCollection = await ContentfulApi.getAllProducts();
	console.log(productsCollection);

	return { paths: productsCollection?.map(({ slug }) => `/products/${slug}`) ?? [], fallback: false };
}
