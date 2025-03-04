import { Sequelize} from 'sequelize';
import dotenv from "dotenv";
import { DiaryModel } from './diary.db';

dotenv.config();

export let conn: Sequelize;

// If we are running jest tests, create a fake db
if (process.env.NODE_ENV === "test") {
    conn = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
    })
}
// Else setup connection for the real db
else {
    const db_password = process.env.DB_PASSWORD;

    if(!db_password){
        console.log("Could not find DB_PASSWORD in .env file")
    }

    else{
        
        conn = new Sequelize({
            dialect : 'postgres',
            username: 'app_db_user',
            password: db_password,
            host: 'localhost',
            port: 5432,
            database: 'postgres'
        })
    }
}

export async function initDB() {
    try {
        await conn.authenticate();
        console.log('Connection has been established successfully.');
        
        // Try syncing and creating the table if it doesn't exist
        await conn.sync({ alter: true, force: false });
        console.log('Database sync complete.');

       
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
