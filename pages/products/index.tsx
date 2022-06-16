import { FC } from 'react';
import Card from '../../components/Card/Card';
import Layout from '../../components/Layout/Layout';
import ContentfulApi from '../../utils/ContentfulApi';

interface Props {
	products: ProductData[];
}

export interface ImageObject {
	title: string;
	description: string;
	url: string;
}

export interface ProductData {
	description: string;
	name: string;
	slug: string;
	imageCollection: imageCollectionData;
}

interface imageCollectionData {
	items: ImageObject[];
}

const Products: FC<Props> = ({ products }) => {
	console.log(products);
	return (
		<Layout>
			<main>
				<h1>Products</h1>
				{products.map((product: any) => (
					<Card title={product.name} url={`/products/${product.slug}`} key={product.sys.id} img={product.imageCollection.items[0]} description={product.description} />
				))}
			</main>
		</Layout>
	);
};

export default Products;

export async function getStaticProps() {
	const products = await ContentfulApi.getAllProducts();
	// Add this with fallback: "blocking"
	// So that if we do not have a post on production,
	// the 404 is served
	if (!products) {
		return {
			notFound: true,
		};
	}
	return { props: { products } };
}
