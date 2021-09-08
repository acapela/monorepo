import fs from "fs";
import path from "path";

const CWD = process.cwd();
const PACKAGE_PATH = path.resolve(CWD, "package.json");

function readPackageFile() {
  const packageJSONContent = fs.readFileSync(PACKAGE_PATH).toString();

  const packageData = JSON.parse(packageJSONContent);

  return packageData;
}

export function readScenariosMap(): ScenariosMap {
  const packageData = readPackageFile();

  return packageData.scenarios as ScenariosMap;
}

export function readScenarioConfig(scenarioName: string): ScenarioConfig {
  const scenariosMap = readScenariosMap();

  return scenariosMap[scenarioName];
}

export type ScenarioStep = {
  commands: string[];
  dependsOnFiles?: string;
  hideLogs?: boolean;
};

export type ScenarioConfig = ScenarioStep[];

export type ScenariosMap = Record<string, ScenarioConfig>;
