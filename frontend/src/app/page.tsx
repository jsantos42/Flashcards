"use client"
import React, {useEffect, useRef, useState} from "react";
import {Deck} from "@/types";
import Link from "next/link";

export default function FlashcardDashboard() {
	const [decks, setDecks] = useState([] as Deck[]);
	const [isAddingDeck, setIsAddingDeck] = useState(false);
	const addDeckForm = useRef<HTMLDivElement>(null);

	// Fetch decks from the backend when the component is mounted
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch('http://localhost:3000/');
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
			const response = await fetch('http://localhost:3000/add-deck', {
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
			<div className='w-full grid grid-cols-desktop gap-4 justify-items-center'>
				{decks.map(deck => (
					<Link href={`/decks/${deck.id}`} key={deck.id}>
						<div className="w-[180px] bg-white shadow-md p-4 rounded-lg text-black">
							<h2 className="text-xl font-bold text-center">{deck.name}</h2>
							<p>{deck.description}</p>
						</div>
					</Link>
				))}
			</div>
			{isAddingDeck && (
				<div className="mt-8 items-center bg-gray-300 rounded-lg p-4"
					 ref={addDeckForm}
				>
					<form onSubmit={addDeck} className="flex flex-col gap-4">
						<input type="text"
							   name="name"
							   placeholder="Deck name"
							   required
							   className="border border-gray-400 px-4 py-2 rounded-lg"
						/>
						<input type="text"
							   name="description"
							   placeholder="Deck description"
							   className="border border-gray-400 px-4 py-2 rounded-lg"
							   required
						/>
						<button type="submit"
								className="bg-blue-500 text-white px-4 py-2 rounded-lg"
						>
							Add Deck
						</button>
					</form>
				</div>
			)}
			<button onClick={() => setIsAddingDeck((prevState) => !prevState)}
					className={`text-white px-4 py-2 rounded-lg mt-4 bg-${isAddingDeck ? 'red' : 'blue'}-500`}
			>
				{isAddingDeck ? 'Cancel' : 'Add New Deck'}
			</button>
		</main>
	);
}
