import Link from 'next/link';

interface Props {
	link: string;
	name: string;
}

const NavItem: React.FC<Props> = ({ link, name }) => {
	return (
		<Link href={link}>
			<li className="ml-4 cursor-pointer font-semibold transition-colors hover:text-cyan-300">{name}</li>
		</Link>
	);
};

export default NavItem;
