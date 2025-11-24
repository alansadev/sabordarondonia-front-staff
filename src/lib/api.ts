import axios from 'axios';

const API_URL = '/api';

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			console.error('Sessão expirada ou não autorizada', error);

			// window.location.href = '/login';
		}

		return Promise.reject(error);
	}
);
