import { chalk } from "zx";

import { ScenarioConfig } from "./config";
import { runScenarioStep } from "./runScenarioStep";

export async function runScenario(scenario: ScenarioConfig) {
  for (const step of scenario) {
    await runScenarioStep(step);

    console.info(chalk.blue(`---------`));
  }
}
