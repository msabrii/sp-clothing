import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImageObject } from '../../utils/interfaces';

const ImageGallery: React.FC<{ images: ImageObject[] }> = ({ images }) => {
	const [current, setCurrent] = useState(images[0]);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		if (modalOpen) {
			window.scrollTo(0, 0);
			document.body.style.overflow = 'hidden';
			return;
		}
		document.body.style.overflow = 'scroll';
	}, [modalOpen]);

	return (
		<div className="flex flex-row">
			<div className="flex flex-col mr-2">
				{images.map((image) => (
					<div className={`rounded-md shadow-xl w-[70px] h-[70px] mb-2 cursor-pointer ${current === image && 'border-[2px] border-black'}`}>
						<Image src={image.url} alt={image.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setCurrent(image)} />
					</div>
				))}
			</div>
			<div className="w-full h-full cursor-pointer">
				<Image src={current.url} alt={current.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setModalOpen(true)} />
			</div>
			<ImageModal open={modalOpen} closeModal={() => setModalOpen(false)}>
				<div className="flex flex-col mr-2">
					{images.map((image) => (
						<div className={`rounded-md shadow-xl w-[70px] h-[70px] mb-2 cursor-pointer ${current === image && 'border-[2px] border-black'}`}>
							<Image src={image.url} alt={image.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setCurrent(image)} />
						</div>
					))}
				</div>
				<div className="w-1/2 h-[full]">
					<div className="p-16">
						<Image src={current.url} alt={current.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" />
					</div>
				</div>
			</ImageModal>
		</div>
	);
};

export default ImageGallery;

const ImageModal: React.FC<{ open: boolean; children: React.ReactNode; closeModal: () => void }> = ({ open, children, closeModal }) => {
	return (
		<div className={`w-screen h-screen absolute top-0 left-0 bg-white flex justify-center items-center ${!open && 'hidden'} animate-slide-in-left`}>
			<button className="absolute right-20 top-10 p-4 rounded-full shadow-lg hover:-translate-y-1 transition-all" onClick={closeModal}>
				X
			</button>
			{children}
		</div>
	);
};
