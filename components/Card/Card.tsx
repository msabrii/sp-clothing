import { useRouter } from 'next/router';
import React from 'react';
import { ImageObject } from '../../utils/interfaces';
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

	_style = { boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', margin: '1rem' };

	/** Override Defaults */
	if (backgroundColor) _style.backgroundColor = backgroundColor;
	if (color) _style.color = color;

	return (
		<div
			className="inline-block text-center relative hover:-translate-y-1 bg-slate-100 rounded-lg transition-transform  w-[190px] xl:w-[250px] xl:h-[320px]"
			tabIndex={0}
			role="button"
			onKeyDown={handleOnKeyDown}
			onClick={handleClick}
			style={_style}
			{...props}
		>
			{img && <img src={img.url} alt={img.description} className="w-full max-h-[245px] rounded-t-lg object-cover" />}
			<div className="p-1 mt-1">
				{title && <p className="text-base">{title}</p>}
				{<p className="font-semibold">£500</p>}
			</div>
			{/* {description && <p className="before:content-[''] before:w-full before:h-[1px] before:left-0 before:bg-black before:opacity-40 before:absolute">{description}</p>} */}
		</div>
	);
};

export default Card;
