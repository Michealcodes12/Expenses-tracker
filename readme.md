### Expense Tracker

A simple expense tracker to manage your finances.

### instalation

```bash
npm install -g .
```

### Features

-- Users can add an expense with a description and amount.
--Users can update an expense.
--Users can delete an expense.
--Users can view all expenses.
--Users can view a summary of all expenses.
--Users can view a summary of expenses for a specific month (of current year
--Users can add expense with categories
--Users can view expenses view expenses by category.
--Users can set a budget for each month and then show a warning when the user exceeds the budget.
--Users can export expenses to a CSV file.

### The list of commands and their expected output is shown below:

```bash
$ expense-tracker add --description "Lunch" --amount 20
# Expense added successfully (ID: 1)

$ expense-tracker add --description "Dinner" --amount 10
# Expense added successfully (ID: 2)

$ expense-tracker list
# ID  Date       Description  Amount
# 1   2024-08-06  Lunch        $20
# 2   2024-08-06  Dinner       $10

$ expense-tracker summary
# Total expenses: $30

$ expense-tracker delete --id 2
# Expense deleted successfully

$ expense-tracker summary
# Total expenses: $20

$ expense-tracker summary --month 8
# Total expenses for August: $20

$ expense-tracker export --output filename.csv
# Expenses exported to file: filename.csv

$ expense-tracker list --category Food
# ID  Date       Description  Amount
# 1   2024-08-06  Lunch        $20

$ expense-tracker budget --amount 50
# Budget set successfully
```

project url: https://roadmap.sh/projects/expense-tracker

made with love 💖
