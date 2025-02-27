import { Sequelize } from 'sequelize';

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
    conn = new Sequelize('postgres://postgres:Commando450@localhost:5432/');
}

export async function initDB() {
    await conn.sync({ alter: true, force: false });
}
