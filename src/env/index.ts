import chalk from "chalk";
import { type TypeOf, z } from "zod";

export type EnvSchema = TypeOf<typeof zodEnv>;

const SUPPORTED_MODELS = ["next-w06"] as const;

export const zodEnv = z.object({
	MODEM_IP: z
		.string({
			required_error: "MODEM_IP is required",
		})
		.min(1, "MODEM_IP is required and cannot be empty"),
	MODEM_USERNAME: z.string({
		required_error: "MODEM_USERNAME is required",
	}),
	// .min(1, "MODEM_USERNAME is required and cannot be empty"),
	MODEM_PASSWORD: z.string({
		required_error: "MODEM_PASSWORD is required",
	}),
	// .min(1, "MODEM_PASSWORD is required and cannot be empty"),
	MODEM_MODEL: z.enum(SUPPORTED_MODELS, {
		required_error: "MODEM_MODEL is required",
	}),
});

export function envValidator(): Promise<EnvSchema> {
	return new Promise((resolve, reject) => {
		const parsed = zodEnv.safeParse(process.env);

		if (!parsed.success) {
			parsed.error.issues.map((issue) => {
				const path = issue.path.toString() as keyof EnvSchema;

				console.error(
					chalk.bgRed.white.bold(" ERROR "),
					chalk.red(`${path}`),
					chalk.white(`\n➤ ${issue.message}`),
					path === "MODEM_MODEL"
						? chalk.white(
								`\n➤ Supported models: ${SUPPORTED_MODELS.join(", ")}`
							)
						: "",
					"\n"
				);
			});

			// const errorMessage = Object.entries(parsed.error.format())
			// 	.map(([key, value]) => {
			// 		if (key === "_errors") return "";
			// 		// @ts-ignore
			// 		return `${chalk.bold.red(`➤ ${key}:`)} ${value._errors?.join(", ")}`;
			// 	})
			// 	.join("\n");

			// console.error(
			// 	chalk.bgRed.white.bold(" ERROR "),
			// 	chalk.red("Invalid environment variables:\n"),
			// 	errorMessage
			// );

			reject(new Error("Environment variable validation failed"));
		} else {
			resolve(parsed.data);
		}
	});
}
