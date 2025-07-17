#!/usr/bin/env node
import { Command } from "commander";
import { AddExpense } from "../actions/add.js";
import path from "path";
import { Readfile } from "../actions/readFile.js";
import chalk from "chalk";
import table from "cli-table3";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { setBudget } from "../actions/budget.js";
import { totalExpense } from "../actions/toalExpense.js";
import { Parser } from "json2csv";
import { check_file_exist } from "../actions/check_if_file_exist.js";
const program = new Command();

//  set the current working directory to the directory of this script
const expensepath = path.join(process.cwd(), "storage/expense.json");
const budgetpath = path.join(process.cwd(), "storage/budget.json");
// This script sets up a command-line interface (CLI) for an expense tracker application.
// It uses the Commander.js library to define the CLI commands and options.
program
  .command("add")
  .description("Add an expense to the tracker")
  .option("-d, --description [string]", "Description of the expense")
  .option("-a, --amount <number>", "Amount of the expense")
  .option("-c, --category [string]", "Category of the expense")
  .action((option) => {
    const { description, amount } = option;
    /**
     * reads the budget file
     */

    let budgetAmount;

    if (existsSync(budgetpath)) {
      budgetAmount = JSON.parse(readFileSync(budgetpath, "utf-8"));
    }

    const { date, budget } = budgetAmount;
    const Allexpenses = Readfile(expensepath);
    const total = totalExpense(Allexpenses);

    if (total > budget) {
      console.log(
        chalk.bgYellowBright(
          chalk.black("Warning: You are spending way passed  your budget")
        )
      );
    }

    /**
     * Checks if the amount is a valid number.
     * If the amount is not a number or is NaN, it logs an error message
     * and exits the process.
     * @param {number} amount - The amount of the expense.
     */
    if (!isFinite(amount) || amount < 0) {
      console.error(
        chalk.red.bold("Error:"),
        chalk.bgCyan(
          chalk.black("Invalid amount. Please provide a valid number.")
        )
      );
      process.exit(1);
    }

    /**
     * Checks if the description is a valid string.
     * If the description is a number, it logs an error message and exits the process.
     * @param {string} description - The description of the expense.
     */
    if (isFinite(description)) {
      console.error("invalid description. Please provide a valid string.");
      process.exit(1);
    }

    /**
     * Checks if the options object has at least two properties.
     * If it does, it calls the AddExpense function to add the expense.
     * If it doesn't, it logs an error message and exits the process.
     * @param {Object} option - The options object containing the expense details.
     * @param {string} expensepath - The path to the storage file where expenses are
     */

    if (Object.keys(option).length >= 2) {
      // Logic to add the expense goes here
      AddExpense(option, expensepath);
    } else {
      console.error(
        chalk.red.bold("Error:"),
        chalk.bgCyan(
          chalk.black(
            "Please provide both description and amount for the expense."
          )
        )
      );

      process.exit(1);
    }
  });

//    This command allows users to list all  expense with a description and amount.
program
  .command("list")
  .description("List all expenses")
  .option("-c, --category [string]", "Filter expenses by category")
  .action((option) => {
    // Logic to list expenses goes here
    // Example output, replace with actual logic
    const { category } = option;

    const expenses = Readfile(expensepath);
    const tabledata = new table({
      head: ["ID", "Description", "Amount", "category", "Date"],
      colWidths: [20, 30, 15, 9, 30],
      style: {
        head: ["cyan"],
        border: ["grey"],
        overflow: ["wrap"],
      },
    });

    if (expenses.length === 0) {
      console.log("No expenses found.");
      return;
    }
    switch (category) {
      case undefined:
        {
          expenses.forEach((expense) => {
            tabledata.push([
              expense.id,
              expense.description,
              `$${expense.amount.toFixed(2)}`,
              expense.category,
              expense.date,
            ]);
          });
          console.log(tabledata.toString());
        }
        break;

      default: {
        try {
          if (category === true) {
            throw new Error("please provide a valid  category");
          } else {
            const filterlist = expenses.filter((expense) => {
              return expense.category === category;
            });

            filterlist.forEach((expense) => {
              tabledata.push([
                expense.id,
                expense.description,
                `$${expense.amount.toFixed(2)}`,
                expense.category,
                expense.date,
              ]);
            });
            console.log(tabledata.toString());
          }
        } catch (error) {
          console.error(chalk.bgRed(chalk.white(error.message)));
        }
      }
    }
  });

//  this command allows users to get a summary of theri expnsese
program
  .command("summary")
  .description("Get a summary of all expenses")
  .option("-m, --month <number>", "Filter expenses by month (optional)")
  .action((optionsData) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // Logic to summarize expenses goes here
    let totalexpense;
    const Allexpenses = Readfile(expensepath);
    const { month } = optionsData;
    if (month !== undefined) {
      const datefilter = Allexpenses.filter((expense) => {
        const date = new Date(expense.date).getMonth() + 1;
        return Number(month) === date;
      });

      if (datefilter.length !== 0) {
        totalexpense = totalExpense(datefilter);
        console.log(
          chalk.bgGreenBright(
            chalk.black(
              `Total Expenses for the month of ${
                months[Number(month)]
              } : $${totalexpense.toFixed(2)}`
            )
          )
        );
      } else {
        console.error(
          chalk.bgRedBright(
            chalk.black(
              `No expenses found for the month ${months[Number(month)]}.`
            )
          )
        );
      }
      process.exit(1);
    }

    if (Allexpenses.length === 0) {
      console.error(
        chalk.bgYellowBright(
          chalk.black("No expenses found. Please add some expenses first.")
        )
      );
    }
    //  This code calculates the total expenses and logs them to the console.

    totalexpense = totalExpense(Allexpenses);

    //  This code logs the total expenses to the console in a formatted manner.
    console.log(
      chalk.green.bold("Total Expenses:"),
      chalk.bgGreenBright(chalk.black(` $${totalexpense.toFixed(2)}`))
    );
  });

program
  .command("delete")
  .description("Delete an expense")
  .option("-i, --id <string>", "ID of the expense to delete")
  .action((optionData) => {
    const option = optionData.id;
    if (!option) {
      console.error(
        chalk.red.bold("Error:"),
        chalk.bgCyan(chalk.black("Please provide an ID to delete the expense."))
      );
      process.exit(1);
    }

    try {
      const expenses = Readfile(expensepath);
      const findExpense = expenses.find((expense) => expense.id === option);

      if (findExpense) {
        const deleteindex = expenses.filter((expense) => expense.id !== option);
        writeFileSync(expensepath, JSON.stringify(deleteindex, null, 2));
        console.log(
          chalk.green.bold("Success:"),
          chalk.bgGreen(
            chalk.black(`Expense with ID ${option} deleted successfully!`)
          )
        );
      } else {
        throw new Error(`Expense with (ID : ${option}) does not exist.`);
      }
    } catch (error) {
      console.error(
        chalk.red.bold(`${error.name}:`),
        chalk.bgCyan(chalk.black(error.message))
      );
    }
  });

program
  .command("budget")
  .description("this is used in set your monthly budget ")
  .option("-a, --amount <number>", "set monthly budget")
  .action((optiondata) => {
    const { amount } = optiondata;
    switch (amount) {
      case true: {
        console.error(
          chalk.red.bold("Error:"),
          chalk.bgCyan(chalk.black("Please provide a valid budget"))
        );

        break;
      }
      case undefined: {
        console.error(
          chalk.red.bold("Error:"),
          chalk.bgCyan(chalk.black("invalid input pls enter a budget"))
        );
        break;
      }

      default: {
        if (!isFinite(amount)) {
          console.error(
            chalk.red.bold("Error:"),
            chalk.bgCyan(chalk.black("invalid input: cannot be a string "))
          );
          process.exit(1);
        }
        setBudget(amount, budgetpath);
      }
    }
  });

program
  .command("export")
  .description("Users can export their expenses to a file and download it")
  .option("-o, --output <string>", "Output files in csv format")
  .action((options) => {
    const { output } = options;

    if (!output) {
      console.log(
        chalk.redBright(chalk.black("Error: pls provide a valid output"))
      );
      process.exit(1);
    }

    if (!existsSync(expensepath)) {
      console.log(
        chalk.bgRedBright(
          chalk.black("ERROR: No file found. Please add some expenses first")
        )
      );

      process.exit(1);
    }
    const donloadPath = path.join(process.cwd(), `downloads/${output}`);
    if (!existsSync(donloadPath)) {
      const expenses = Readfile(expensepath);
      //     CHECKS IF THE FILE IS EMPTY
      if (expenses.length === 0) {
        console.log(
          chalk.bgRedBright(chalk.black("ERROR: filename already exist"))
        );
        process.exit(1);
      }

      try {
        const fileds = ["id", "description", "amount", "category", "date"];
        const jsoncsvparser = new Parser({ fileds });
        const csvdata = jsoncsvparser.parse(expenses);
        writeFileSync(donloadPath, csvdata);
        console.log(
          chalk.green.bold(
            `SUCCESS: Expenses exported successfully to (downloads/${output})`
          )
        );
      } catch (error) {
        console.error(chalk.red.bold("Error during export:"), error.message);
        process.exit(1);
      }
    } else {
      console.log(
        chalk.bgRedBright(chalk.black("ERROR: filename already exist"))
      );
    }
  });

program.parse(process.argv);
