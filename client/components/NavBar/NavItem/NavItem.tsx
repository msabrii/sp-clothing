import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

interface Props {
	link: string;
	name?: string;
	icon?: IconDefinition;
}

const NavItem: React.FC<Props> = ({ link, name, icon }) => {
	return (
		<li className="ml-4 cursor-pointer font-semibold transition-colors hover:text-cyan-300">
			<Link href={link}>{icon ? <FontAwesomeIcon icon={icon} /> : name}</Link>
		</li>
	);
};

export default NavItem;
