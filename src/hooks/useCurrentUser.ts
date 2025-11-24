import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export interface CurrentUser {
	id: string;
	name: string;
	email?: string;
	role?: 'ADMIN' | 'CASHIER' | 'DISPATCHER';
}

export const useCurrentUser = () => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: ['current-user'],
		queryFn: async () => {
			try {
				const { data } = await api.get<CurrentUser>('/users/me');
				return data;
			} catch (error: unknown) {
				const anyError = error as { response?: { status?: number } };
				if (anyError.response?.status === 401) {
					navigate('/staff/login');
				}
				throw error;
			}
		},
		retry: false,
	});
};
