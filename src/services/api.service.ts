import Axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "./api.types";

export type CustomAxiosRequestConfig = AxiosRequestConfig & {
	showSuccessToast?: boolean;
	successMessage?: string;
	showErrorToast?: boolean;
	errorMessage?: string;
};

const defaultConfig: Partial<CustomAxiosRequestConfig> = {
	showSuccessToast: true,
	successMessage: "Success",
	showErrorToast: true,
	errorMessage: "Error",
};

const requestTimeout = 15000;

export class HttpService {
	private http: AxiosInstance;
	private baseUrl = process.env.MODEM_IP;

	constructor() {
		this.http = Axios.create({
			baseURL: `${this.baseUrl}`,
			timeout: requestTimeout,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.http.interceptors.request.use(
			this.handleRequest,
			this.handleRequestError
		);

		this.http.interceptors.response.use(
			this.handleSuccessResponse,
			this.handleErrorResponse
		);
	}

	// private getToken = () => {
	// 	const token = `Basic ${this.secretToken}`;

	// 	return token;
	// };

	private handleRequest = (config: InternalAxiosRequestConfig) => {
		// config.headers.Authorization = this.getToken();

		return config;
	};

	private handleRequestError = (error: AxiosError) => {
		return Promise.reject(error);
	};

	private handleSuccessResponse = (response: AxiosResponse<ApiResponse>) => {
		const config = response.config as CustomAxiosRequestConfig;
		const result = response.data;

		// for success toast in tui
		if (config.showSuccessToast) {
		}

		return response;
	};

	private handleErrorResponse = (error: AxiosError<ApiResponse>) => {
		const config = error.config as CustomAxiosRequestConfig;

		const result = error.response?.data;

		// for error toast in tui
		if (config?.showErrorToast) {
		}

		return Promise.reject(error);
	};

	public async get<T>(
		url: string,
		config?: CustomAxiosRequestConfig
	): Promise<ApiResponse<T>> {
		const finalConfig = { ...defaultConfig, ...config };

		const response = await this.http.get(url, finalConfig);

		return {
			data: response.data,
			status: response.status,
		};
	}

	public async post<T>(
		url: string,
		data: unknown,
		config?: CustomAxiosRequestConfig
	) {
		const finalConfig = { ...defaultConfig, ...config };

		const response = await this.http.post<ApiResponse<T>>(
			url,
			data,
			finalConfig
		);

		return response.data;
	}

	public async put<T>(
		url: string,
		data: unknown,
		config?: CustomAxiosRequestConfig
	) {
		const finalConfig = { ...defaultConfig, ...config };

		const response = await this.http.put<ApiResponse<T>>(
			url,
			data,
			finalConfig
		);

		return response.data;
	}
}
