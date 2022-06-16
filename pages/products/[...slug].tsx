import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { FC } from 'react';
import Layout from '../../components/Layout/Layout';
import ContentfulApi from '../../utils/ContentfulApi';
import { ProductData } from './';

interface IProductDetails {
	product: ProductData;
}

const ProductDetails: FC<IProductDetails> = ({ product }) => {
	// const router = useRouter();
	// const slug = router.query.slug || [];

	// console.log(product);

	return (
		<Layout seo={product.seo}>
			<h1>{product.name}</h1>
			<Image src={product.imageCollection.items[0].url} alt={product.imageCollection.items[0].description} layout="fixed" objectFit="cover" loading="eager" height="500px" width="400px" />
		</Layout>
	);
};

export default ProductDetails;

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const product = await ContentfulApi.getProductBySlug(params!.slug![0]);

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
	return { paths: productsCollection?.map((product: { slug: string }) => `/products/${product.slug}`) ?? [], fallback: false };
};
