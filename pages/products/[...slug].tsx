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
			<div className="flex flex-col xl:flex-row xl:gap-8 justify-center items-center  mb-4 xl:min-h-[800px] min-h-[600px]">
				<div className="w-full xl:w-1/2 h-full">
					<ImageGallery images={product.imageCollection.items} />
				</div>
				<div className="flex flex-col w-full xl:w-1/2 h-full justify-between">
					<h2 className="mb-4">{product.name}</h2>
					<h4 className="mb-4">300$</h4>
					<p className="mb-2">Choose a size</p>
					<SizeList sizes={product.sizeList.sizes} handleClick={(s) => setSize(s)} currentSize={size} />
					<button className="border-black border p-2 my-6 hover:text-white hover:bg-black transition-all duration-300">Add to Cart</button>
					<p className="mt-2">{product.description}</p>
				</div>
			</div>
		</Layout>
	);
};

const SizeList: React.FC<{ sizes: number[]; handleClick: (_size: number) => void; currentSize: number | null }> = ({ sizes, handleClick, currentSize }) => {
	return (
		<div className="flex flex-row flex-grow flex-wrap">
			{sizes
				.sort((a, b) => a - b)
				.map((size, idx) => (
					<button
						key={idx}
						onClick={() => handleClick(size)}
						className={`border border-black w-12 h-12 mr-2 mb-2 flex justify-center items-center cursor-pointer ${currentSize === size && 'bg-black text-white'}`}
					>
						{size}
					</button>
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
	return { paths: productsCollection?.map((product: { slug: string }) => `/products/${product.slug}`).flat() ?? [], fallback: false };
};
