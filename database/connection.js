import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('expenseManager')
        console.log('Connection to mongo DB established successfully!')
    }
    catch(err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit app if unable to connect
    }
}

async function getDb() {
    if(!db) throw new Error('DB not initialized. Call connectDB first.');
    return db;
}

export { connectDB, getDb };

