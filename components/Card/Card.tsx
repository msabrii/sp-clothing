import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { ImageObject } from '../../pages/products/index';

interface ICardProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	backgroundColor?: string;
	color?: string;
	img?: ImageObject;
	title?: string;
	description?: string;
	url: string;
}

const Card: React.FC<ICardProps> = (props) => {
	const { backgroundColor, color, style, url, img, title, description } = props;
	let _style: React.CSSProperties = style || {};

	const router = useRouter();

	const handleClick = () => {
		router.push(url);
	};

	const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') router.push(url);
	};

	_style = { boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', margin: '1rem', width: 'fit-content' };

	/** Override Defaults */
	if (backgroundColor) _style.backgroundColor = backgroundColor;
	if (color) _style.color = color;

	return (
		<div className="inline-block text-center relative hover:-translate-y-1 transition-transform" tabIndex={0} role="button" onKeyDown={handleOnKeyDown} onClick={handleClick} style={_style} {...props}>
			{img && <Image src={img.url} alt={img.description} width="200px" height="200px" />}
			{/* {img && <img src={img.url} alt={img.description} width="200px" height={'200px'} />} */}
			{title && <h2 className="font-semibold text-lg">{title}</h2>}
			{description && <p className="before:content-[''] before:w-full before:h-[1px] before:left-0 before:bg-black before:opacity-40 before:absolute">{description}</p>}
		</div>
	);
};

export default Card;
