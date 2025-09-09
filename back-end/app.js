import express from 'express';
import cors from 'cors';
import player from './src/routes/playerRoutes.js';
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
app.get('/admin', (req, res) => {
    const senha = req.query.senha;
    if (senha === process.env.ADMIN_PASSWORD) {
        res.sendFile('./public/admin.html', { root: '.' });
    } else {
        res.status(401).send('Senha incorreta');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});