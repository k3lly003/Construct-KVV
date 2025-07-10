export function calculateOverExpense(
  entries: { expenseAmount: number }[],
  bidAmount: number
) {
  const totalExpense = entries.reduce(
    (sum, entry) => sum + Number(entry.expenseAmount),
    0
  );
  const overSpent = totalExpense > bidAmount;
  const percentUsed =
    bidAmount === 0 ? 0 : Math.round((totalExpense / bidAmount) * 100);
  return { overSpent, percentUsed };
}
export default calculateOverExpense;
