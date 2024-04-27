import {Request, Response} from 'express';
import {prisma} from "../app";

export const showSelectedFlashcard = async (req: Request, res: Response) => {
	const {deckId, flashcardId} = req.params;
	try {
		const flashcard = await prisma.flashcard.findUnique({
			where: {
				id: Number(flashcardId)
			}
		});

		if (!flashcard) {
			return res.status(404).json({error: 'Flashcard not found'});
		}
		if (flashcard.deckId !== Number(deckId)) {
			return res.status(404).json({error: 'Flashcard not found in this deck'});
		}
		res.json(flashcard);
	} catch (error) {
		console.error('Error fetching flashcard:', error);
		res.status(500).json({error: 'Internal server error'});
	}
}

export const addFlashcard = async (req: Request, res: Response) => {
	const {deckId} = req.params;
	const {question, answer} = req.body;
	try {
		const deck = await prisma.deck.findUnique({
			where: {
				id: Number(deckId)
			}
		});

		if (!deck) {
			return res.status(404).json({error: 'Deck not found'});
		}

		const newFlashcard = await prisma.flashcard.create({
			data: {
				question,
				answer,
				deckId: Number(deckId),
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});
		res.json(newFlashcard);
	} catch (error) {
		console.error('Error creating flashcard:', error);
		res.status(500).json({error: 'Internal server error'});
	}
}

export const toggleRememberFlashcard = async (req: Request, res: Response) => {
	const {deckId, flashcardId} = req.params;
	try {
		const flashcard = await prisma.flashcard.findUnique({
			where: {
				id: Number(flashcardId)
			}
		});

		if (!flashcard) {
			return res.status(404).json({error: 'Flashcard not found'});
		}
		if (flashcard.deckId !== Number(deckId)) {
			return res.status(404).json({error: 'Flashcard not found in this deck'});
		}

		const updatedFlashcard = await prisma.flashcard.update({
			where: {
				id: Number(flashcardId)
			},
			data: {
				remembered: !flashcard.remembered
			}
		});
		res.json(updatedFlashcard);
	} catch (error) {
		console.error('Error updating flashcard:', error);
		res.status(500).json({error: 'Internal server error'});
	}
}