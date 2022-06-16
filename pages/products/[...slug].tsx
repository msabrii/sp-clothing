import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC, useState } from 'react';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
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
	const [size, setSize] = useState<number | null>(null);

	return (
		<Layout seo={product.seo}>
			<div className="flex flex-row justify-center items-center gap-8 mb-4 lg:min-h-[800px] min-h-[600px]">
				<div className="w-1/2 h-full">
					<ImageGallery images={product.imageCollection.items} />
				</div>
				<div className="flex flex-col w-1/2 h-full justify-between">
					<h2>{product.name}</h2>
					<h4>300$</h4>
					<p>Choose a size</p>
					<SizeList sizes={[6, 7, 8, 9, 10]} handleClick={(s) => setSize(s)} currentSize={size} />
					<button className="border-black border p-2 mt-2 hover:text-white hover:bg-black transition-all duration-300">Add to Cart</button>
					<p className="mt-2">{product.description}</p>
				</div>
			</div>
		</Layout>
	);
};

const SizeList: React.FC<{ sizes: number[]; handleClick: (size: number) => void; currentSize: number | null }> = ({ sizes, handleClick, currentSize }) => {
	return (
		<div className="flex flex-row">
			{sizes.map((size) => (
				<span onClick={() => handleClick(size)} className={`border border-black w-12 h-12 mr-2 flex justify-center items-center cursor-pointer ${currentSize === size && 'bg-black text-white'}`}>
					{size}
				</span>
			))}
		</div>
	);
};

export default ProductDetails;

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const product = await ContentfulApi.getProductBySlug(params!.slug![0]);

	// Add this with fallback: "blocking"
	// So that if we do not have a product on production,
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
