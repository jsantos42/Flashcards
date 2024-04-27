import {Request} from "express";
import {prisma} from "../app";
import {mockFlashcards, res} from "./jest.setup";
import {addFlashcard, showSelectedFlashcard, toggleRememberFlashcard} from "../controllers/flashcardController";

describe('Flashcard Controllers', () => {
	describe('showSelectedFlashcard', () => {
		it('should return a single flashcard', async () => {
			const req = {
				params: {
					deckId: '1',
					flashcardId: ''
				}
			} as unknown as Request;

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(mockFlashcards[0]);
			await showSelectedFlashcard(req, res);
			expect(res.json).toHaveBeenCalledWith(mockFlashcards[0]);
		});

		it('should not return a flashcard that does not exist', async () => {
			const req = {
				params: {
					deckId: '',
					flashcardId: ''
				}
			} as unknown as Request;

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(null);
			await showSelectedFlashcard(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({error: 'Flashcard not found'});
		});

		it('should not return a flashcard that is not in the deck', async () => {
			const req = {
				params: {
					deckId: '1',
					flashcardId: ''
				}
			} as unknown as Request;

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(mockFlashcards[1]);
			await showSelectedFlashcard(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({error: 'Flashcard not found in this deck'});
		});

		it('should handle errors gracefully', async () => {
			const req = {
				params: {
					deckId: '',
					flashcardId: ''
				}
			} as unknown as Request;
			const error = new Error('Error message');

			(prisma.flashcard.findUnique as jest.Mock).mockRejectedValue(error);
			await showSelectedFlashcard(req, res);
			expect(console.error).toHaveBeenCalledWith('Error fetching flashcard:', error)
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
		});
	});

	describe('addFlashcard', () => {
		it('should create a new flashcard', async () => {
			const req = {
				params: {
					deckId: '1'
				},
				body: {
					question: 'foo',
					answer: 'bar'
				}
			} as unknown as Request;

			(prisma.deck.findUnique as jest.Mock).mockResolvedValue({
				id: 1,
				name: 'foo',
				description: 'bar'
			});
			(prisma.flashcard.create as jest.Mock).mockResolvedValue(mockFlashcards[0]);
			await addFlashcard(req, res);
			expect(res.json).toHaveBeenCalledWith(mockFlashcards[0]);
		});

		it('should not create a flashcard if the deck does not exist', async () => {
			const req = {
				params: {
					deckId: ''
				},
				body: {
					question: 'foo',
					answer: 'bar'
				}
			} as unknown as Request;

			(prisma.deck.findUnique as jest.Mock).mockResolvedValue(null);
			await addFlashcard(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({error: 'Deck not found'});
		});

		it('should handle errors gracefully', async () => {
			const req = {
				params: {
					deckId: '1'
				},
				body: {
					question: 'foo',
					answer: 'bar'
				}
			} as unknown as Request;
			const error = new Error('Error message');

			(prisma.deck.findUnique as jest.Mock).mockResolvedValue({
				id: 1,
				name: 'foo',
				description: 'bar'
			});
			(prisma.flashcard.create as jest.Mock).mockRejectedValue(error);
			await addFlashcard(req, res);
			expect(console.error).toHaveBeenCalledWith('Error creating flashcard:', error)
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
		});
	});

	describe('toggleRememberFlashcard', () => {
		it('should toggle the remembered status of a flashcard', async () => {
			const req = {
				params: {
					deckId: '1',
					flashcardId: '1'
				}
			} as unknown as Request;
			const initialFlashcard = {...mockFlashcards[0], remembered: false};
			const updatedFlashcard = {...mockFlashcards[0], remembered: true};

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(initialFlashcard);
			(prisma.flashcard.update as jest.Mock).mockResolvedValue(updatedFlashcard);
			await toggleRememberFlashcard(req, res);
			expect(prisma.flashcard.update).toHaveBeenCalledWith({
				where: {
					id: 1
				},
				data: {
					remembered: !initialFlashcard.remembered
				}
			});
			expect(res.json).toHaveBeenCalledWith(updatedFlashcard);
		});

		it('should not toggle the remembered status of a flashcard that does not exist', async () => {
			const req = {
				params: {
					deckId: '1',
					flashcardId: ''
				}
			} as unknown as Request;

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(null);
			await toggleRememberFlashcard(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({error: 'Flashcard not found'});
		});

		it('should not toggle the remembered status of a flashcard that is not in the deck', async () => {
			const req = {
				params: {
					deckId: '1',
					flashcardId: ''
				}
			} as unknown as Request;

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(mockFlashcards[1]);
			await toggleRememberFlashcard(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({error: 'Flashcard not found in this deck'});
		});

		it('should handle errors gracefully', async () => {
			const req = {
				params: {
					deckId: '1',
					flashcardId: '1'
				}
			} as unknown as Request;
			const error = new Error('Error message');

			(prisma.flashcard.findUnique as jest.Mock).mockResolvedValue(mockFlashcards[0]);
			(prisma.flashcard.update as jest.Mock).mockRejectedValue(error);
			await toggleRememberFlashcard(req, res);
			expect(console.error).toHaveBeenCalledWith('Error updating flashcard:', error)
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
		});
	});
})