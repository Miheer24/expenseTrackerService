import { getDb } from '../database/connection';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const getAllExpenses = async ({user: { email }}) => {
    const db = await getDb();
    const expenses = await db.collection('expenses')?.find({user: email}).toArray();
    return expenses;
}

export const createExpense = async (req) => {
    const db = await getDb();
    const date = new Date();
    const { body, user: { email} } = req;
    const newDoc = {
        ...body,
        createdAt: date,
        updatedAt: null,
        month: monthNames[date.getMonth()],
        year: date. getFullYear(),
        user: email
    }
    const expenses = await db.collection('expenses')?.insertOne(newDoc);
    return expenses;
}