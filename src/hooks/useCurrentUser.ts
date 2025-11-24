import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface CurrentUser {
	id: string;
	name: string;
	email?: string;
	role?: 'ADMIN' | 'CASHIER' | 'DISPATCHER';
}

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ['current-user'],
		queryFn: async () => {
			const { data } = await api.get<CurrentUser>('/users/me');
			return data;
		},
		retry: false,
	});
};
