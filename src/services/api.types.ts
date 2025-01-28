import type { AxiosResponse } from "axios";

export type ApiResponse<T = unknown> = {
	readonly status?: number | null;
	readonly message?: string | null;
	data?: T;
	fullResponse?: AxiosResponse<T>;
};
