import { envValidator } from "@/env";
import { NextW06ServiceTest } from "@/services/next-w06/http.services";

async function main() {
	try {
		const env = await envValidator();
		await NextW06ServiceTest();
	} catch (error) {
		process.exit(1);
	}
}

main();
