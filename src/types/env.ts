import type { EnvSchema } from "@/env";

declare module "bun" {
	interface Env extends EnvSchema {}
}
