import { api } from '../lib/api';

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	imageUrl: string;
	stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
	const { data } = await api.get<Product[]>('/products');
	return data;
};
