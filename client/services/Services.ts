import axios from 'axios';
import { AuthApi, Configuration, SignInResponse } from '../api';

const configuration = new Configuration({
	basePath: `http://localhost:3000`,
});

const axiosInstance = axios.create();
const authResponseIntercepter = axiosInstance.interceptors.response.use(
	(res) => res,
	async (error) => {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.status !== 401) {
				return Promise.reject(error);
			}

			axios.interceptors.response.eject(authResponseIntercepter);

			const refresh = localStorage.getItem('refreshToken');
			if (refresh) {
				return authApi.signInRefreshPost({ token: refresh }).then((res) => {
					const refreshResponse = res.data as SignInResponse;
					localStorage.setItem('accessToken', refreshResponse.access_token);
					localStorage.setItem('idToken', refreshResponse.id_token);
					localStorage.setItem('refreshToken', refreshResponse.refresh_token);

					if (error.response?.config.headers) {
						error.response.config.headers['Authorization'] = 'Bearer ' + refreshResponse.access_token;
						return axios(error.response.config);
					}
				});
			} else {
				return Promise.reject(error);
			}
		}
	}
);

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token && config.headers) {
		config.headers.Authorization = 'Bearer ' + token;
	}
	return config;
});

export const authApi = new AuthApi(configuration);
