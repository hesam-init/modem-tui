import { envValidator } from "@/env";
import { HuaweiHttpService } from "@/services/huawei/http.services";

async function main() {
	try {
		const env = await envValidator();
		const huawei = new HuaweiHttpService();

		huawei.start();
	} catch (error) {
		process.exit(1);
	}
}

main();
