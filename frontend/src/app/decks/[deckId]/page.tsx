"use client"
import {Flashcard} from "@/types";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {AddingForm} from "@/app/components/AddingForm";

export default function SingleDeck({
   params: {deckId}
}: {params: { deckId: string }
}) {
	const [flashcards, setFlashcards] = useState([] as Flashcard[]);
	const [isAddingFlashcard, setIsAddingFlashcard] = useState(false);
	const addFlashcardForm = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);

	// Fetch flashcards from the backend when the component is mounted
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${deckId}`);
				const fetchedFlashcards = await response.json();
				// This should be split into different pages
				if (response.status === 404 || response.status === 500) {
					router.replace('/not-found');
					return;
				}
				setFlashcards(fetchedFlashcards);
			} catch (error) {
				console.error('Error fetching flashcards:', error);
			}
		})();
	}, []);


	// Scroll to the add flashcard form when it is rendered
	useEffect(() => {
		if (isAddingFlashcard && addFlashcardForm.current) {
			addFlashcardForm.current.scrollIntoView({behavior: 'smooth'});
		}
	}, [isAddingFlashcard]);


	const addFlashcard = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${deckId}/add-flashcard`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question: formData.get('question'),
					answer: formData.get('answer')
				})
			});
			const newFlashcard = await response.json();
			setFlashcards([...flashcards, newFlashcard]);
		} catch (error) {
			console.error('Error adding flashcard:', error);
		}
		setIsAddingFlashcard(false);
	}

	const toggleRememberFlashcard = async () => {
		const currentFlashcard = flashcards[currentFlashcardIndex];
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decks/${deckId}/flashcards/${currentFlashcard.id}/remember`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
			});
			const updatedFlashcard = await response.json();
			setFlashcards((prevState) => prevState.map((flashcard) => {
				if (flashcard.id === updatedFlashcard.id) {
					return updatedFlashcard;
				}
				return flashcard;
			}));
		} catch (error) {
			console.error('Error updating flashcard:', error);
		}
	}

	const nextFlashcard = (remembered: boolean) => {
		if (remembered !== flashcards[currentFlashcardIndex].remembered) {
			toggleRememberFlashcard();
		}
		setIsFlipped(false);
		if (currentFlashcardIndex === flashcards.length - 1) {
			setCurrentFlashcardIndex(0);
			return;
		}
		setCurrentFlashcardIndex((prevState) => prevState + 1);
	}
	// TBD: Extract code to separate reusable components
	return (
		<div className="flex min-h-screen flex-col items-center justify-start p-4 pt-14 lg:p-24">
			<h1 className="mb-20 text-xl text-center font-bold">
				Deck {deckId}
			</h1>
			{flashcards.length > 0 && (
				<>
					<h2>Flashcard {currentFlashcardIndex + 1} out of {flashcards.length}</h2>
					<div className='w-full grid grid-cols-desktop gap-4 justify-items-center'>
						{flashcards[currentFlashcardIndex] && (
							<div key={flashcards[currentFlashcardIndex].id}
								 className="w-10/12 sm:w-[500px] h-[200px] bg-white
						 shadow-md p-4 rounded-lg text-black flex flex-col items-center justify-center">
								<h2 className="font-semibold">{flashcards[currentFlashcardIndex].question}</h2>
								{isFlipped && (
									<>
										<p>{flashcards[currentFlashcardIndex].answer}</p>
										<p className="text-xs">{flashcards[currentFlashcardIndex].remembered ?
											'You already knew this' : 'You did not know this'
										}</p>
									</>
								)}
							</div>
						)}
					</div>
					<div className="flex gap-4">
						{isFlipped ? (
							<>
								<button
									onClick={() => nextFlashcard(true)}
									className={`text-white px-4 py-2 rounded-lg mt-4 bg-green-400`}
								>
									Remembered
								</button>
								<button
									onClick={() => nextFlashcard(false)}
									className={`text-white px-4 py-2 rounded-lg mt-4 bg-red-500`}
								>
									Did not remember
								</button>
							</>
						) : (
							<button
								onClick={() => setIsFlipped((prevState) => !prevState)}
								className={`text-black px-4 py-2 rounded-lg mt-4 `}
							>
								Show answer
							</button>
						)}
					</div>
				</>
			)}
			{isAddingFlashcard &&
				<AddingForm ref={addFlashcardForm} onSubmit={addFlashcard} elementType="Flashcard"/>
			}
			<button
				onClick={() => setIsAddingFlashcard((prevState) => !prevState)}
				className={`text-white px-4 py-2 rounded-lg mt-4 ${isAddingFlashcard ? 'bg-red-500' : 'bg-blue-500'}`}
			>
				{isAddingFlashcard ? 'Cancel' : 'Add New Flashcard'}
			</button>
			<button
				onClick={() => router.back()}
				className={`text-white px-4 py-2 rounded-lg mt-4 bg-gray-600`}
			>
				Back
			</button>
		</div>
	)
		;
}