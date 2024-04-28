import {Request, Response} from 'express';
import {prisma} from "../app";

export const showAllDecks = async (req: Request, res: Response) => {
	try {
		const decks = await prisma.deck.findMany();
		res.json(decks);
	} catch (error) {
		console.error('Error fetching decks:', error);
		res.status(500).json({error: 'Internal server error'});
	}
}

export const addDeck = async (req: Request, res: Response) => {
	const {name, description} = req.body;
	try {
		const newDeck = await prisma.deck.create({
			data: {
				name,
				description
			}
		});

		res.json(newDeck);
	} catch (error) {
		console.error('Error creating deck:', error);
		res.status(500).json({error: 'Internal server error'});
	}
}

export const showSelectedDeckFlashcards = async (req: Request, res: Response) => {
	const {deckId} = req.params;
	try {
		const deck = await prisma.deck.findUnique({
			where: {
				id: Number(deckId)
			}
		});

		if (!deck) {
			return res.status(404).json({error: 'Deck not found'});
		}

		const flashcards = await prisma.flashcard.findMany({
			where: {
				deckId: Number(deckId)
			}
		});
		res.json(flashcards);
	} catch (error) {
		console.error('Error fetching deck:', error);
		res.status(500).json({error: 'Internal server error'});
	}
}