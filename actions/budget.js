import chalk from "chalk";
import { writeFileSync } from "fs";

export function setBudget(budget, budgetpath) {
  try {
    writeFileSync(
      budgetpath,
      JSON.stringify({ budget: Number(budget), date: new Date() }, null, 2)
    );

    console.log(
      chalk.bgGreenBright(chalk.black("Success: Budget set successfully!"))
    );
  } catch (error) {
    console.log(error);
  }
}
