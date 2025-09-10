import db from '../db/db.js';

const createPlayer = async (name, profilePicture) => {
    const database = await db.openDB();
    const result = await database.run(
        'INSERT INTO players (name, profile_picture) VALUES (?, ?)',
        [name, profilePicture]
    );
    return result.lastID;
}

const getPlayers = async () => {
    const database = await db.openDB();
    return database.all('SELECT * FROM players');
}

const getPlayerById = async (id) => {
    const database = await db.openDB();
    return database.get('SELECT * FROM players WHERE id = ?', [id]);
}

const alterarPontos = async (id, pontos) => {
    const database = await db.openDB();
    const player = await getPlayerById(id);
    if (player) {
        const newScore = player.score + pontos;
        await database.run('UPDATE players SET score = ? WHERE id = ?', [newScore, id]);
        return newScore;
    }
    throw new Error('Jogador não encontrado');
}

const tirarVida = async (id) => {
    const database = await db.openDB();
    const player = await getPlayerById(id);
    if (player) {
        if (player.lifes > 0) {
            const lifes = player.lifes - 1;
            await database.run('UPDATE players SET lifes = ? WHERE id = ?', [lifes, id]);
            return lifes;
        } else {
            return 0;
        }
    }
    throw new Error('Jogador não encontrado');
}

export default {
    createPlayer,
    getPlayers,
    getPlayerById,
    alterarPontos,
    tirarVida
};