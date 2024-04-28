import Router from 'express';
import {addDeck, showAllDecks, showSelectedDeckFlashcards} from "../controllers/deckController";
import {addFlashcard, showSelectedFlashcard, toggleRememberFlashcard} from "../controllers/flashcardController";

const router = Router();

router.get('/', showAllDecks);
router.post('/add-deck', addDeck);
router.get('/decks/:deckId', showSelectedDeckFlashcards);
router.get('/decks/:deckId/flashcards/:flashcardId', showSelectedFlashcard);
router.post('/decks/:deckId/add-flashcard', addFlashcard);
router.post('/decks/:deckId/flashcards/:flashcardId/remember', toggleRememberFlashcard);


export default router;
