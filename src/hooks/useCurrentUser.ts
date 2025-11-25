import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export interface CurrentUser {
	id: string;
	name: string;
	email?: string;
	roles?: Array<'ADMIN' | 'CASHIER' | 'DISPATCHER'>;
}

export const useCurrentUser = () => {
	const navigate = useNavigate();

	const query = useQuery({
		queryKey: ['current-user'],
		queryFn: async () => {
			const { data } = await api.get<CurrentUser>('/users/me');
			return data;
		},
		retry: false,
	});

	useEffect(() => {
		if (query.isError) {
			navigate('/login');
		}
	}, [query.isError, navigate]);

	return query;
};
