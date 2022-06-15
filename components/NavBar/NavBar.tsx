import Link from 'next/link';
import NavItem from './NavItem/NavItem';

const NavBar = () => {
	return (
		<nav className="w-full bg-cyan-600">
			<div className="wrapper flex flex-row items-center justify-between text-white">
				<Link href="/">
					<h1>SP</h1>
				</Link>
				<ul className="flex flex-row text-white relative">
					<NavItem name="Home" link="/" />
					<NavItem name="Products" link="/products" />
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
