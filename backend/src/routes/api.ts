import Router from 'express';
import {addDeck, showAllDecks, showSelectedDeck} from "../controllers/deckController";

const router = Router();

router.get('/', showAllDecks);
router.post('/add-deck', addDeck);
router.get('/deck:deckId', showSelectedDeck);

export default router;
