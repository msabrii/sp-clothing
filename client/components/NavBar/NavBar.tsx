import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import NavItem from './NavItem/NavItem';

const NavBar = () => {
	const { cartItems } = useContext(CartContext);
	const { user, signOut } = useContext(AuthContext);
	const router = useRouter();

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
					<li className="ml-4 cursor-pointer font-semibold transition-colors hover:text-cyan-300">
						<button onClick={user ? signOut : () => router.push('/login')}>{user ? 'Logout' : 'Log In'}</button>
					</li>
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
