import Link from 'next/link';

const NavBar = () => {
	return (
		<nav className="w-full bg-cyan-600">
			<div className="wrapper flex flex-row items-center justify-between text-white">
				<Link href="/">
					<h1>SP</h1>
				</Link>
				<ul className="flex flex-row text-white">
					<Link href="/">
						<li className="ml-4 cursor-pointer transition-colors">Home</li>
					</Link>
					<Link href="/products">
						<li className="ml-4 cursor-pointer transition-colors">Products</li>
					</Link>
				</ul>
			</div>
		</nav>
	);
};

export default NavBar;
