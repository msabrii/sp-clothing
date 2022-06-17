import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import { ProductData } from '../pages/products';

interface CartItems {
	cartItems: cartItem[] | undefined;
	setCartItems: Dispatch<SetStateAction<cartItem[] | undefined>>;
}

interface ProviderProps {
	children: React.ReactNode;
}

interface cartItem {
	item: ProductData;
	size: number;
}

export const CartContext = createContext<CartItems>({} as CartItems);

export const CartContextProvider: React.FC<ProviderProps> = ({ children }) => {
	const [cartItems, setCartItems] = useState<cartItem[] | undefined>();
	return <CartContext.Provider value={{ cartItems, setCartItems }}>{children}</CartContext.Provider>;
};
