import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
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
			<div className="flex flex-col lg:mr-2">
				{images.map((image, idx) => (
					<div className={`lg:block hidden border overflow-hidden  rounded-md shadow-xl w-[70px] h-[70px] mb-2 cursor-pointer ${current === image && 'border-[2px] border-black'}`} key={idx}>
						<Image src={image.url} alt={image.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setCurrent(image)} />
					</div>
				))}
			</div>
			<div className="w-full h-full cursor-pointer">
				<div className="lg:block hidden ">
					<Image src={current.url} alt={current.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setModalOpen(true)} />{' '}
				</div>
				<Swiper className="lg:hidden block z-0" spaceBetween={50} slidesPerView={1} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
					{images.map((image, idx) => (
						<SwiperSlide key={idx}>
							<Image src={image.url} alt={image.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setModalOpen(true)} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<ImageModal open={modalOpen} closeModal={() => setModalOpen(false)}>
				<div className="flex-col lg:mr-2 lg:flex hidden ">
					{images.map((image, idx) => (
						<div key={idx} className={`rounded-md shadow-xl w-[70px] h-[70px] mb-2 cursor-pointer ${current === image && 'border-[2px] border-black'}`}>
							<Image src={image.url} alt={image.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" onClick={() => setCurrent(image)} />
						</div>
					))}
				</div>
				<div className="w-full lg:w-1/2 h-[full]">
					<div className="lg:block hidden lg:p-16">
						<Image src={current.url} alt={current.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" />
					</div>
					<div className="lg:hidden block w-full h-full">
						<Swiper spaceBetween={50} slidesPerView={1} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
							{images.map((image, idx) => (
								<SwiperSlide key={idx}>
									<Image src={image.url} alt={image.description} layout="responsive" objectFit="cover" loading="eager" height="100%" width="100%" />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</ImageModal>
		</div>
	);
};

export default ImageGallery;

const ImageModal: React.FC<{ open: boolean; children: React.ReactNode; closeModal: () => void }> = ({ open, children, closeModal }) => {
	return (
		<div className={`z-50 w-screen h-screen absolute top-0 left-0 bg-white flex justify-center items-center ${!open && 'hidden'} animate-slide-in-left`}>
			<button className="w-14 h-14 p-2 absolute right-8 lg:right-20 top-10 rounded-full shadow-lg hover:-translate-y-1 transition-all" onClick={closeModal}>
				<FontAwesomeIcon icon={faClose} className="w-full h-full" />
			</button>
			{children}
		</div>
	);
};
