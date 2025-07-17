import { existsSync, writeFileSync } from "fs";
import chalk from "chalk";

export function check_file_exist(expensepath) {
  try {
    if (!existsSync(expensepath)) {
      writeFileSync(expensepath, JSON.stringify([]));
    }
  } catch (error) {
    console.error(
      chalk.red.bold("Error:"),
      chalk.bgCyan(chalk.black(`could not check file (${error.message})`))
    );
  }
}
