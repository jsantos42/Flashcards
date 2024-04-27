import {Response} from "express";

jest.mock('../app', () => ({
	prisma: {
		deck: {
			create: jest.fn(),
			findUnique: jest.fn(),
			findMany: jest.fn(),
		}
	}
}));

// Suppress console.error output in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

export const mockDecks = [
	{
		id: 1,
		name: 'foo1',
		description: 'bar1'
	},
	{
		id: 2,
		name: 'foo2',
		description: 'bar2'
	},
	{
		id: 3,
		name: 'foo3',
		description: 'bar3'
	},
];

export const mockFlashcards = [
	{
		id: 1,
		question: 'foo1',
		answer: 'bar1',
		remembered: false,
		deckId: 1
	},
	{
		id: 2,
		question: 'foo2',
		answer: 'bar2',
		remembered: false,
		deckId: 2
	},
	{
		id: 3,
		question: 'foo3',
		answer: 'bar3',
		remembered: false,
		deckId: 3
	},
];

// Mock Express Response object
export const res = {
	json: jest.fn(),
	// This method needs to return `this` to allow chaining in the controller
	status: jest.fn().mockReturnThis()
} as unknown as Response;
