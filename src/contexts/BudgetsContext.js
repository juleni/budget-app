import React, { useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext();

export function useBudgets() {
  return useContext(BudgetsContext);
}

/**
 * BUDGET object:
 * - id
 * - name
 * - max
 *
 * EXPENSES object:
 * - id
 * - budgetId
 * - amount
 * - description
 *
 **/

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  function getBudgetExpenses(budgetId) {
    return expenses.filter((expense) => expense.budgetId === budgetId);
  }
  function addExpense({ budgetId, amount, description }) {
    setExpenses((prevExpense) => {
      return [...prevExpense, { id: uuidV4, budgetId, amount, description }];
    });
  }
  function addBudget({ name, max }) {
    setBudgets((prevBudget) => {
      if (prevBudget.find((budget) => budget.name === name)) {
        return prevBudget;
      }
      return [...prevBudget, { id: uuidV4, name, max }];
    });
  }
  function deleteBudget({ id }) {
    // TODO: Deal with expenses - uncategorized
    setBudgets((prevBudget) => {
      return prevBudget.find((budget) => budget.id !== id);
    });
  }
  function deleteExpense({ id }) {
    setExpenses((prevExpense) => {
      return prevExpense.find((expense) => expense.id !== id);
    });
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
