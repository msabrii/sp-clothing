import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
		<div className="flex flex-col-reverse items-center xl:items-start xl:flex-row mt-8 xl:mt-0">
			<div className="flex flex-col lg:flex-row xl:flex-col xl:mr-2 gap-2">
				{images.map((image, idx) => (
					<button
						className={`lg:flex hidden border rounded-md w-[70px] h-[70px] mb-2 cursor-pointer ${current === image && 'border-[2px] border-cyan-600 shadow-lg'}`}
						key={idx}
						onClick={() => setCurrent(image)}
					>
						<img src={image.url} alt={image.description} className="rounded-md object-cover w-full h-full" />
					</button>
				))}
			</div>
			<div className="w-full h-full cursor-pointer mb-4">
				<button className="hidden lg:flex  w-full" onClick={() => setModalOpen(true)}>
					<img src={current.url} alt={current.description} className="object-cover w-full xl:w-[500px] h-[500px]" />
				</button>
				<Swiper className="lg:hidden block z-0" spaceBetween={50} slidesPerView={1}>
					{images.map((image, idx) => (
						<SwiperSlide key={idx} onClick={() => setModalOpen(true)}>
							<img src={image.url} alt={image.description} className="w-full h-[350px] object-cover" />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<ImageModal open={modalOpen} closeModal={() => setModalOpen(false)}>
				<div className="flex-col xl:mr-2 xl:flex hidden">
					{images.map((image, idx) => (
						<button key={idx} className={`rounded-md shadow-xl w-[70px] h-[70px] mb-2 cursor-pointer ${current === image && 'border-[2px] border-black'}`} onClick={() => setCurrent(image)}>
							<img src={image.url} alt={image.description} className="rounded-md object-cover w-full h-full" />
						</button>
					))}
				</div>
				<div className="w-full xl:w-1/2 h-[full]">
					<div className="xl:block hidden xl:p-16">
						<img src={current.url} alt={current.description} />
					</div>
					<div className="xl:hidden block w-full h-full">
						<Swiper spaceBetween={50} slidesPerView={1} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
							{images.map((image, idx) => (
								<SwiperSlide key={idx}>
									<img src={image.url} alt={image.description} />
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
			<button className="w-14 h-14 p-2 absolute right-8 xl:right-20 top-10 rounded-full shadow-xl hover:-translate-y-1 transition-all" onClick={closeModal}>
				<FontAwesomeIcon icon={faClose} className="w-full h-full" />
			</button>
			{children}
		</div>
	);
};
