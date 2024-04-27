import Router from 'express';
import {addDeck, showAllDecks, showSelectedDeck} from "../controllers/deckController";
import {addFlashcard, showSelectedFlashcard, toggleRememberFlashcard} from "../controllers/flashcardController";

const router = Router();

router.get('/', showAllDecks);
router.post('/add-deck', addDeck);
router.get('/deck:deckId', showSelectedDeck);
router.get('/deck:deckId/flashcard:flashcardId', showSelectedFlashcard);
router.post('/deck:deckId/add-flashcard', addFlashcard);
router.post('/deck:deckId/flashcard:flashcardId/remember', toggleRememberFlashcard);


export default router;
