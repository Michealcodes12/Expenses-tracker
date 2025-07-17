export const totalExpense = (data) => {
  const total = data.reduce((acc, expense) => {
    return (acc += expense.amount);
  }, 0);

  return total;
};
