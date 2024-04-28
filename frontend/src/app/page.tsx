"use client"
import React, {useEffect, useRef, useState} from "react";
import {Deck} from "@/types";
import {DeckGrid} from "@/app/components/DeckGrid";
import {AddDeckForm} from "@/app/components/AddDeckForm";

export default function FlashcardDashboard() {
	const [decks, setDecks] = useState([] as Deck[]);
	const [isAddingDeck, setIsAddingDeck] = useState(false);
	const addDeckForm = useRef<HTMLDivElement>(null);

	// Fetch decks from the backend when the component is mounted
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
				const fetchedDecks = await response.json();
				setDecks(fetchedDecks);
			} catch (error) {
				console.error('Error fetching decks:', error);
			}
		})();
	}, []);


	// Scroll to the add deck form when it is rendered
	useEffect(() => {
		if (isAddingDeck && addDeckForm.current) {
			addDeckForm.current.scrollIntoView({behavior: 'smooth'});
		}
	}, [isAddingDeck]);

	const addDeck = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-deck`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formData.get('name'),
					description: formData.get('description')
				})
			});
			const newDeck = await response.json();
			setDecks([...decks, newDeck]);
		} catch (error) {
			console.error('Error adding deck:', error);
		}
		setIsAddingDeck(false);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-start p-4 pt-14 lg:p-24">
			<h1 className="mb-20 text-3xl lg:text-4xl text-center font-bold">
				Flashcard Dashboard
			</h1>
			<DeckGrid {...{decks}} />
			{isAddingDeck && <AddDeckForm ref={addDeckForm} onSubmit={addDeck} />}
			<button
				onClick={() => setIsAddingDeck((prevState) => !prevState)}
				className={`text-white px-4 py-2 rounded-lg mt-4 bg-${isAddingDeck ? 'red' : 'blue'}-500`}
			>
				{isAddingDeck ? 'Cancel' : 'Add New Deck'}
			</button>
		</main>
	);
}
