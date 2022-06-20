import Card from '../components/Card/Card';
import Layout from '../components/Layout/Layout';
import styles from '../styles/Home.module.css';
import ContentfulApi from '../utils/ContentfulApi';
import { ProductData } from './products';

interface IHomeProps {
	products: ProductData[];
}

const Home: React.FC<IHomeProps> = ({ products }) => {
	return (
		<Layout seo={{ metaTitle: 'SP', metaDescription: 'SP Home Page' }}>
			<div className={styles.container}>
				<main>
					<h1>Home</h1>
					<h2>New Arrivals</h2>
					<div className="flex flex-row flex-wrap">
						{products.map((product, idx) => (
							<Card key={idx} title={product.name} url={`/products/${product.slug}`} />
						))}
					</div>
				</main>
			</div>
		</Layout>
	);
};

export default Home;

export async function getStaticProps() {
	const products = await ContentfulApi.getNewProducts();

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
