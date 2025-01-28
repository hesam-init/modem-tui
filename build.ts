// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { readdirSync } from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from "path";

async function getDirectoryFiles(path: string): Promise<string[]> {
	try {
		const filesList = readdirSync(path)
			.filter((file) => {
				return file.endsWith(".js");
			})
			.map((file) => join(path, file));

		return filesList;
	} catch (error) {
		console.error(`Error reading directory ${path}:`, error);
		return [];
	}
}

async function main() {
	const result = await Bun.build({
		entrypoints: ["./main.ts"],
		env: "inline",
		target: "node",
		outdir: "./dist",
		packages: "bundle",
		sourcemap: "linked",
		splitting: true,
		format: "esm",
	});

	const widgetPath = "node_modules/blessed/lib/widgets";
	const widgetFiles = await getDirectoryFiles(widgetPath);

	await Bun.build({
		entrypoints: [...widgetFiles],
		target: "node",
		outdir: "./dist/widgets",
		packages: "external",
		format: "esm",
	});

	console.log(result.outputs);
	console.log(result.success ? "Build successful" : "Build failed");
}

main();
