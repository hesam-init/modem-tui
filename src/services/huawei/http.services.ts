import crypto from "node:crypto";
import { HttpService } from "../api.service";
import type { NextW06ApiResponse } from "./api.response";
import { NextW06ApiRoutes } from "./api.routes";

export class HuaweiHttpService extends HttpService {
	private authId = process.env.MODEM_USERNAME;
	private authPW = process.env.MODEM_PASSWORD;

	public debugMode = false;

	constructor() {
		super({
			xml: true,
		});
	}

	async start() {
		const { data } = await this.getBaseTokens();

		this.setSessionCookie(`SessionID=${data?.SesInfo}` || "");
		console.log(this.sessionCookie);

		this.setVerificationToken(data?.TokInfo || "");
		console.log(data);

		this.postLogin();
	}

	async postLogin() {
		// const hash = CryptoJS.SHA256(this.authPW + this.verificationToken).toString(
		// 	CryptoJS.enc.Hex
		// );

		const hash = crypto
			.createHash("sha256")
			.update(this.authPW + this.verificationToken)
			.digest("hex");

		const tokenizedPW = Buffer.from(hash, "hex").toString("base64");
		const data = {
			Username: this.authId,
			Password: tokenizedPW,
			password_type: 4,
		};

		console.log(this.xmlBuilder(data));

		// return this.post(NextW06ApiRoutes.Login, this.xmlBuilder(data));
	}

	async getBaseTokens() {
		const result = await this.get<NextW06ApiResponse["BaseTokens"]>(
			NextW06ApiRoutes.BaseTokens
		);

		return result;
	}

	async getTempToken() {
		const result = await this.get<NextW06ApiResponse["TempToken"]>(
			NextW06ApiRoutes.TempToken
		);

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
