import { FC } from 'react';
import Card from '../../components/Card/Card';
import Layout from '../../components/Layout/Layout';
import ContentfulApi from '../../utils/ContentfulApi';
import { imageCollectionData, SEO } from '../../utils/interfaces';

interface Props {
	productPage: {
		name: string;
		slug: string;
		seo: SEO;
	};
	products: ProductData[];
}

export interface ProductData {
	description: string;
	name: string;
	slug: string;
	imageCollection: imageCollectionData;
	seo: SEO;
}

const Products: FC<Props> = ({ productPage, products }) => {
	console.log(products);
	return (
		<Layout seo={productPage.seo}>
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
	const productPage = await ContentfulApi.getPageBySlug('products');
	const products = await ContentfulApi.getAllProducts();
	// Add this with fallback: "blocking"
	// So that if we do not have a post on production,
	// the 404 is served
	if (!products || !productPage) {
		return {
			notFound: true,
		};
	}
	return { props: { productPage, products } };
}
