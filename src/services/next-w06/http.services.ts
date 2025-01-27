import { HttpService } from "../api.service";
import type { NextW06ApiResponse } from "./api.response";
import { NextW06ApiRoutes } from "./api.routes";

export class NextW06HttpService extends HttpService {
	constructor() {
		super({
			debug: false,
			xml: true,
		});
	}

	async getBasicInformation() {
		try {
			const response = await this.get<NextW06ApiResponse["BasicInformation"]>(
				NextW06ApiRoutes.BasicInformation
			);

			return response.data;
		} catch (error) {
			console.log(error);
		}
	}
}

export async function NextW06ServiceTest() {
	const service = new NextW06HttpService();

	const data = await service.getBasicInformation();

	console.log(data);
}
