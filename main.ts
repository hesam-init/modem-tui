import { envValidator } from "@/env";

async function main() {
	try {
		const env = await envValidator();

		console.log(env);
	} catch (error) {
		process.exit(1);
	}
}

main();
