import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC } from 'react';
import ContentfulApi from '../../utils/ContentfulApi';
import { ProductData } from './';

interface IProductDetails {
	product: ProductData;
}

const ProductDetails: FC<IProductDetails> = ({ product }) => {
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const product = await ContentfulApi.getProductBySlug(params!.slug as string);

	// Add this with fallback: "blocking"
	// So that if we do not have a post on production,
	// the 404 is served
	if (!product) {
		return {
			notFound: true,
		};
	}
	return { props: { product } };
};

export const getStaticPaths: GetStaticPaths = async () => {
	const productsCollection = await ContentfulApi.getAllProducts();
	return { paths: productsCollection?.map(({ slug }) => `/products/${slug}`) ?? [], fallback: false };
};
