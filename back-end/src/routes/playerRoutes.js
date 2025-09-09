import { Router } from 'express';
import playerController from '../controllers/playerController.js';
const router = Router();

router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);

router.post('/', playerController.createPlayer);
router.post('/:id/alterar-pontos', playerController.alterarPontos);

export default router;