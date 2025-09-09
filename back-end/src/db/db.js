import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDB() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}

export async function initDB() {
    const db = await openDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            profile_picture TEXT NOT NULL,
            isAlive INTEGER DEFAULT 1,
            lives INTEGER DEFAULT 3
        )
    `);
    return db;
}

export async function closeDB(db) {
    await db.close();
    console.log('Conexão com o banco de dados encerrada.');
}

// Initialize the database when this module is loaded
initDB().then(() => {
    console.log('Banco de dados inicializado com sucesso.');
}).catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
});

export default {
    openDB,
    initDB,
    closeDB
};