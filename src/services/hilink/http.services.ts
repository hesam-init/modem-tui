import CryptoJs from "crypto-js";
import { HttpService } from "../api.service";
import type { HilinkApiResponse } from "./api.responses";
import { HilinkApiRoutes } from "./api.routes";

export class HilinkHttpService extends HttpService {
	private modemUsername = process.env.MODEM_USERNAME;
	private modemPassword = process.env.MODEM_PASSWORD;

	constructor() {
		super({
			debug: false,
			xml: true,
		});
	}

	async start() {
		const getTokens = await this.getBaseTokens();
		this.setSessionCookie(`SessionID=${getTokens.data?.SesInfo}` || "");
		this.setVerificationToken(getTokens.data?.TokInfo || "");

		const postLogin = await this.postLogin();
		const authToken = postLogin.fullResponse?.headers["set-cookie"]?.toString();
		this.setSessionCookie(authToken || "");
	}

	async postLogin() {
		// Type 3: Base64 encode the password
		// Type 4: Base64(sha256(user + Base64(sha256(password)) + token))

		const sha256Password = CryptoJs.SHA256(this.modemPassword).toString(
			CryptoJs.enc.Hex
		);
		const base64Password = Buffer.from(sha256Password).toString("base64");

		const tokenizedPassword = CryptoJs.SHA256(
			`${this.modemUsername}${base64Password}${this.verificationToken}`
		).toString(CryptoJs.enc.Hex);
		const encryptedPassword = Buffer.from(tokenizedPassword).toString("base64");

		// console.log(`Sha256 ${sha256Password}`);
		// console.log(`Base64 ${base64Password}`);
		// console.log(`Tokenized ${tokenizedPassword}`);
		// console.log(`Encrypted ${encryptedPassword}`);

		const data = {
			request: {
				Username: this.modemUsername,
				Password: encryptedPassword,
				password_type: 4,
			},
		};

		return this.post(HilinkApiRoutes.Login, data, {
			fullResponse: true,
		});
	}

	async getStateLogin() {
		return this.get<HilinkApiResponse["StateLogin"]>(
			HilinkApiRoutes.StateLogin
		);
	}

	async getBaseTokens() {
		return this.get<HilinkApiResponse["BaseTokens"]>(
			HilinkApiRoutes.BaseTokens
		);
	}

	async getBasicInformation() {
		return this.get<HilinkApiResponse["BasicInformation"]>(
			HilinkApiRoutes.BasicInformation
		);
	}

	async getInformation() {
		return this.get<HilinkApiResponse["Information"]>(
			HilinkApiRoutes.Information
		);
	}

	async getTrafficStatistics() {
		return this.get<HilinkApiResponse["TrafficStatistics"]>(
			HilinkApiRoutes.TrafficStatistics
		);
	}

	async getUsbTethering() {
		return this.get(HilinkApiRoutes.UsbTethering);
	}

	async getStatus() {
		return this.get<HilinkApiResponse["Status"]>(HilinkApiRoutes.Status);
	}
}
