import { envValidator } from "@/env";
import { HilinkHttpService } from "@/services/hilink/http.services";

async function main() {
	try {
		const env = await envValidator();
		const huawei = new HilinkHttpService();

		huawei.start();
	} catch (error) {
		process.exit(1);
	}
}

main();
