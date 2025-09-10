import { Router } from 'express';
const router = Router();

let jogoIniciado = false;

router.get('/', (req, res) => {
    if (jogoIniciado) {
        res.send(true);
    }
    else {
        res.status(400).send('Jogo não iniciado');
    }
});

router.post('/', (req, res) => {
    jogoIniciado = true;
    res.sendStatus(200);
});

export default router;