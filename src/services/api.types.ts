export type ApiResponse<T = unknown> = {
	readonly status?: number | null;
	readonly message?: string | null;
	data?: T;
};

export type ApiParams<T = unknown> = T & {
	context?: "view" | "edit";
	page?: number;
	per_page?: number;
	slug?: string;
};
