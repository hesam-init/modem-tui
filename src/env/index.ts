import chalk from "chalk";
import { type TypeOf, z } from "zod";

export type EnvSchema = TypeOf<typeof zodEnv>;

export const zodEnv = z.object({
	MODEM_IP: z
		.string({
			message: "MODEM_IP is required",
		})
		.min(1, "MODEM_IP is required and cannot be empty"),
	MODEM_USERNAME: z.string({
		message: "MODEM_USERNAME is required",
	}),
	// .min(1, "MODEM_USERNAME is required and cannot be empty"),
	MODEM_PASSWORD: z.string({
		message: "MODEM_PASSWORD is required",
	}),
	// .min(1, "MODEM_PASSWORD is required and cannot be empty"),
});

export function envValidator(): Promise<EnvSchema> {
	return new Promise((resolve, reject) => {
		const parsed = zodEnv.safeParse(process.env);

		if (!parsed.success) {
			const errorMessage = Object.entries(parsed.error.format())
				.map(([key, value]) => {
					if (key === "_errors") return "";
					// @ts-ignore
					return `${chalk.bold.red(`➤ ${key}:`)} ${value._errors?.join(", ")}`;
				})
				.filter(Boolean)
				.join("\n");

			console.error(
				chalk.bgRed.white.bold(" ERROR "),
				chalk.red("Invalid environment variables:\n"),
				errorMessage
			);

			reject(new Error("Environment variable validation failed"));
		} else {
			resolve(parsed.data);
		}
	});
}
