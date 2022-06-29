import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import NavItem from './NavItem/NavItem';

const NavBar = () => {
	const { cartItems } = useContext(CartContext);

	return (
		<nav className="w-full bg-cyan-600">
			<div className="wrapper flex flex-row items-center justify-between text-white">
				<Link href="/">
					<h1>SP</h1>
				</Link>
				<ul className="flex flex-row text-white relative">
					<NavItem name="Home" link="/" />
					<NavItem name="Products" link="/products" />
					<NavItem name="About Us" link="/about-us" />
					<span className="relative">
						<NavItem icon={faShoppingCart} link="/cart" />
						{cartItems && <div className="flex items-center absolute -top-1 -right-3 justify-center rounded-full w-4 h-4 bg-red-600 text-xs">{cartItems.length}</div>}
					</span>
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
