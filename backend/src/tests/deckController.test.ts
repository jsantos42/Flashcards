import {Request} from "express";
import {prisma} from "../app";
import {mockDecks, res} from "./jest.setup";
import {addDeck, showAllDecks, showSelectedDeck} from "../controllers/deckController";

describe('Deck Controllers', () => {
	describe('showAllDecks', () => {
		it('should return all decks', async () => {
			const req = {} as Request;

			(prisma.deck.findMany as jest.Mock).mockResolvedValue(mockDecks);
			await showAllDecks(req, res)
			expect(res.json).toHaveBeenCalledWith(mockDecks)
		});

		it('should handle errors gracefully', async () => {
			const req = {} as Request;
			const error = new Error('Error message');

			(prisma.deck.findMany as jest.Mock).mockRejectedValue(error);
			await showAllDecks(req, res);
			expect(console.error).toHaveBeenCalledWith('Error fetching decks:', error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
		});
	});

	describe('addDeck', () => {
		it('should create and return a new deck', async () => {
			const newDeck = mockDecks[0];
			const req = {body: newDeck} as Request;

			(prisma.deck.create as jest.Mock).mockResolvedValue(newDeck);
			await addDeck(req, res);
			expect(res.json).toHaveBeenCalledWith(newDeck);
		});

		it('should handle errors gracefully', async () => {
			const req = {body: {}} as Request;
			const error = new Error('Error message');

			(prisma.deck.create as jest.Mock).mockRejectedValue(error);
			await addDeck(req, res);
			expect(console.error).toHaveBeenCalledWith('Error creating deck:', error)
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
		});
	});

	describe('showSelectedDeck', () => {
		it('should return a single deck', async () => {
			const req = {params: {}} as Request;
			const fetchedDeckId = 2;

			(prisma.deck.findUnique as jest.Mock).mockResolvedValue(mockDecks[fetchedDeckId]);
			await showSelectedDeck(req, res);
			expect(res.json).toHaveBeenCalledWith(mockDecks[fetchedDeckId]);
		});

		it('should not return a deck that does not exist', async () => {
			const req = {params: {}} as Request;

			(prisma.deck.findUnique as jest.Mock).mockResolvedValue(null);
			await showSelectedDeck(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({error: 'Deck not found'});
		});

		it('should handle errors gracefully', async () => {
			const req = {params: {}} as Request;
			const error = new Error('Error message');

			(prisma.deck.findUnique as jest.Mock).mockRejectedValue(error);
			await showSelectedDeck(req, res);
			expect(console.error).toHaveBeenCalledWith('Error fetching deck:', error)
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
		});
	});
})