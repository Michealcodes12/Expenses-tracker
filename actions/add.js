import { check_file_exist } from "./check_if_file_exist.js";
import { writeFileSync } from "fs";
import { Readfile } from "./readFile.js";
import { v4 as uuidv4 } from "uuid";
import chalk from "chalk";

export function AddExpense(expense, expensepath) {
  // Check if the file exists, if not create it
  check_file_exist(expensepath);
  //   get all items in thr storage
  const expensedata = Readfile(expensepath);

  // Logic to add the expense to the storage
  const { description, amount, category } = expense;
  const expenseID = uuidv4(); // Generate a unique ID for the expense
  const check_if_data_exist = expensedata.find(
    (item) => item.description === description
  );

  const newexpense = {
    id: expenseID,
    description: description,
    amount: parseFloat(amount),
    date: new Date().toISOString(),
    category: category || "",
  };
  try {
    if (!check_if_data_exist) {
      expensedata.push(newexpense);
      writeFileSync(expensepath, JSON.stringify(expensedata, null, 2));
      console.log(
        chalk.bgGreen(
          chalk.black(
            `SUCCESS: Expense added successfully!  ( ID: ${newexpense.id})`
          )
        )
      );
    } else {
      throw new Error(
        `Expense already exists with this  ( ID: ${check_if_data_exist.id})`
      );
    }
  } catch (error) {
    console.error(
      chalk.red.bold("Error:"),
      chalk.bgCyan(chalk.black(error.message))
    );
  }
}
