import playerModel from "../models/playerModel.js";

const getAllPlayers = async (req, res) => {
    try {
        const players = await playerModel.getPlayers();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar jogadores' });
    }
};

const getPlayerById = async (req, res) => {
    const { id } = req.params;
    try {
        const player = await playerModel.getPlayerById(id);
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ error: 'Jogador não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar jogador' });
    }
};

const createPlayer = async (req, res) => {
    const { name, profile_picture } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    try {
        const playerId = await playerModel.createPlayer(name, profile_picture);
        res.status(201).json({ id: playerId, name, profile_picture, score: 0 });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar jogador' });
    }
};

const alterarPontos = async (req, res) => {
    const { id } = req.params;
    const { pontos } = req.body;
    if (typeof pontos !== 'number') {
        return res.status(400).json({ error: 'Pontos deve ser um número' });
    }
    try {
        const newScore = await playerModel.alterarPontos(id, pontos);
        res.status(200).json({ id, newScore });
    } catch (error) {
        if (error.message === 'Jogador não encontrado') {
            res.status(404).json({ error: 'Jogador não encontrado' });
        } else {
            res.status(500).json({ error: 'Erro ao alterar pontos' });
        }
    }
};

export default {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    alterarPontos
};
