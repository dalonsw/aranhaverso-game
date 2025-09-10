import express from 'express';
import cors from 'cors';
import player from './src/routes/playerRoutes.js';
import game from './src/routes/gameRoutes.js';
import db from './src/db/db.js';
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;
dotenv.config();

app.use(cors(
    {
        origin: '*',
        credentials: "*"
    }
));
app.use(express.json());

db.openDB().then(() => {
    console.log('Conexão com o banco de dados estabelecida.');
}).catch(err => {
    console.error('Erro para abrir o banco de dados:', err);
});

// Rotas
app.use('/player', player);
app.use('/iniciar-jogo', game);

// Rota para verificar a senha de admin
app.get('/admin', (req, res) => {
    const senha = req.query.senha;
    if (senha === process.env.ADMIN_PASSWORD) {
        res.sendStatus(200);
    } else {
        res.status(401).send('Senha incorreta');
    }
});

app.get('/respostas', (req, res) => {
    res.sendFile('./src/data/respostas.json', { root: '.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});