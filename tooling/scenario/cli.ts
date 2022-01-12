// APP env var is required for config to load.
// TODO: It's a bit awkward.
process.env.APP = "tooling";
// Will make zx handle colors of sub commands.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.env.FORCE_COLOR = 3 as any as string;

import "@aca/config/dotenv";

import { run } from "./run";

run();
