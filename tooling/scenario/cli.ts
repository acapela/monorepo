// APP env var is required for config to load.
// TODO: It's a bit awkward.
process.env.APP = "tooling";
process.env.FORCE_COLOR = 3 as any;

import "~config/dotenv";

import { run } from "./run";

run();
