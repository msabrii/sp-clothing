import Layout from '../components/Layout/Layout';
import styles from '../styles/Home.module.css';

interface IHomeProps {
	seo: {
		canonicalUrl?: string;
		title: string;
		description: string;
	};
}

const Home: React.FC<IHomeProps> = ({ seo }) => {
	return (
		<Layout seo={{ title: 'mango', description: 'PEACH' }}>
			<div className={styles.container}>
				<main>
					<h1>Home</h1>
				</main>
			</div>
		</Layout>
	);
};

export default Home;
