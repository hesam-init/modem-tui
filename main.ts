import { envValidator } from "@/env";
import { Dashboard } from "@/tui";

async function main() {
	try {
		await envValidator();

		const dashboard = new Dashboard();
		dashboard.render();
	} catch (error) {
		process.exit(1);
	}
}

main();
