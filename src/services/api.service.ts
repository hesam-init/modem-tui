import Axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { XMLParser } from "fast-xml-parser";
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

export type ServiceConfig = {
	debug?: boolean;
	xml?: boolean;
};

export class HttpService {
	public http: AxiosInstance;
	public sessionCookie = "";

	private baseUrl = process.env.MODEM_IP;
	private debugMode = false;
	private xmlMode = false;

	constructor(config?: ServiceConfig) {
		if (config?.debug) {
			this.debugMode = true;
		}

		if (config?.xml) {
			this.xmlMode = true;
		}

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

	public setSessionCookie = (cookie: string) => {
		this.sessionCookie = cookie;
	};

	private handleRequest = (config: InternalAxiosRequestConfig) => {
		if (this.sessionCookie) {
			config.headers.Cookie = this.sessionCookie;
		}

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

		if (this.debugMode) {
			console.log(response);
		}

		if (this.xmlMode) {
			const parser = new XMLParser();
			const data = parser.parse(response.data);

			return {
				data: data.response || data,
				status: response.status,
			};
		}

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
