import { readFileSync } from "fs";
import { check_file_exist } from "./check_if_file_exist.js";
import chalk from "chalk";

export function Readfile(expensepath) {
  check_file_exist(expensepath);
  try {
    const data = readFileSync(expensepath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(
      chalk.red.bold("Error: "),
      chalk.bgCyan(chalk.black(`$ can not read file ({error.message})`))
    );
  }
}
