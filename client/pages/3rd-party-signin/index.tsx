import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ThirdPartySignIn = () => {
	const router = useRouter();

	useEffect(() => {
		const { code } = router.query;
		console.log(code);
		if (code) {
			localStorage.setItem('loginCode', code as string);
			window.close();
		}
	}, [router.query]);

	return <div className="routesWrapper flex flex-col items-center text-left w-full lg:w-[386px]" data-testid="3rd-party-sign-in-container"></div>;
};

export default ThirdPartySignIn;
