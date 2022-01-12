import "@aca/config/dotenv";

import { $, question } from "zx";

import { readScenariosMap } from "./config";
import { runScenario } from "./ScenarioRunner";

async function selectScenario() {
  const scenarios = readScenariosMap();
  const scenarioNames = Object.keys(scenarios);

  if (scenarioNames.length === 0) {
    throw new Error("No scenarios defined in package.json scenarios field");
  }

  if (scenarioNames.length === 1) {
    const scenarioName = scenarioNames[0];
    const selectedScenario = scenarios[scenarioName];
    return [selectedScenario, scenarioName] as const;
  }

  const pickedScenarioName = await question("Choose scenario to run", {
    choices: scenarioNames,
  });

  const selectedScenario = scenarios[pickedScenarioName];

  return [selectedScenario, pickedScenarioName] as const;
}

export async function run() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Dev command should not be run in production`);
  }

  /**
   * We'll manually handle commands logs by adding command prefix.
   *
   * $.verbose = true would cause all logs to be displayed as is.
   */
  $.verbose = false;

  const [scenario] = await selectScenario();

  // console.info(chalk.blue(`Running ${scenarioName} scenario`));

  await runScenario(scenario);
}
