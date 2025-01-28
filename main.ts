import { envValidator } from "@/env";
import { HilinkHttpService } from "@/services/hilink/http.services";

async function main() {
	try {
		await envValidator();

		const huawei = new HilinkHttpService();
		await huawei.start();
		const information = await huawei.getInformation();

		console.log(information);
	} catch (error) {
		process.exit(1);
	}
}

main();
