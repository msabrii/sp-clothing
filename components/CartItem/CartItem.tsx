import { cartItem as Props } from '../../context/CartContext';

const CartItem: React.FC<Props> = ({ item, size }) => {
	return (
		<li className="w-full flex justify-center mb-12 relative">
			<div className="w-28 h-28 mr-3">
				<img src={item.imageCollection.items[0].url} alt={item.imageCollection.items[0].title} className="object-cover w-full h-full rounded-md" />
			</div>
			<div className="flex flex-col justify-evenly">
				<p>{item.name}</p>
				<p>Price £500</p>
				<p>Size UK {size}</p>
			</div>
		</li>
	);
};

export default CartItem;
