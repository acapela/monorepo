import path from "path";

import glob from "glob";
import watch from "glob-watcher";
import inquirer from "inquirer";
import { $, chalk, nothrow, question } from "zx";

const BASE_DIR = path.resolve(__dirname, "..");

async function run() {
  const possibleTests = glob.sync("**/*.test.ts", { cwd: BASE_DIR });

  const answer = await inquirer.prompt({
    name: "testName",
    message: "Which test to develop",
    choices: possibleTests,
    type: "list",
  });
  const autoReloadAnswer = await inquirer.prompt({
    name: "autoReload",
    message: "Should restart tests on each test file save?",
    choices: ["yes", "no"],
    type: "list",
  });

  const shouldAutoReload = autoReloadAnswer["autoReload"] === "yes";
  const pickedTest = answer["testName"] as string;

  if (!pickedTest) return;

  console.info(`Will execute tests in ${pickedTest}`);

  let test: ReturnType<typeof $>;

  if (shouldAutoReload) {
    watch("**/*.ts", { cwd: BASE_DIR }, async (done) => {
      console.info(`Some file changed - restarting the tests`);

      await runTestAgain();
      done();
    });
  }

  async function runTestAgain() {
    if (test) {
      console.info(chalk.gray("Restarting the tests\n"));
      await test.kill("SIGINT");
    }

    test = nothrow($`PWDEBUG=1 APP=e2e playwright test ${pickedTest}`);
  }

  runTestAgain();

  let isCleaningAlready = false;
  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, async function () {
      if (isCleaningAlready) return;
      isCleaningAlready = true;
      console.info("\nExiting...");
      if (test) {
        await test.kill("SIGINT");
      }

      process.exit(0);
    });
  });

  async function questionLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await question(chalk.bold.blue("Press enter to restart the tests\n"));
      await runTestAgain();
    }
  }

  questionLoop();
}

run();
