import { HttpService } from "../api.service";
import type { NextW06ApiResponse } from "./api.response";
import { NextW06ApiRoutes } from "./api.routes";

export class NextW06HttpService extends HttpService {
	constructor() {
		super({
			debug: true,
			xml: true,
		});
	}

	async getTempToken() {
		const result = await this.get<NextW06ApiResponse["TempToken"]>(
			NextW06ApiRoutes.TempToken
		);

		this.setSessionCookie(`SessionID=${result.data?.token}` || "");

		return result;
	}

	async getBasicInformation() {
		return this.get<NextW06ApiResponse["BasicInformation"]>(
			NextW06ApiRoutes.BasicInformation
		);
	}

	async getUsbTethering() {
		return this.get(NextW06ApiRoutes.UsbTethering);
	}

	async getStatus() {
		return this.get<NextW06ApiResponse["Status"]>(NextW06ApiRoutes.Status);
	}
}

export async function NextW06ServiceTest() {
	const service = new NextW06HttpService();

	service.getTempToken().then(async (res) => {
		const basicData = await service.getStatus();

		console.log(basicData);
	});

	// const data = await service.getTempToken();

	// console.log(data);
}
