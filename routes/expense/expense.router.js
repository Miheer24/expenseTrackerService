import { Router } from 'express';
import { getAllExpenses, createExpense } from '../../services/expense.service';

const expenseRouter = Router();

expenseRouter.get('/all', async (req, res) => {
    try {
        const expenses = await getAllExpenses(req);
        res.status(200).json(expenses);
    }
    catch(error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

expenseRouter.post('/create', async (req, res) => {
    try {
        const expense = await createExpense(req);
        res.status(201).json(expense);
    }
    catch(err) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
})

export default expenseRouter;