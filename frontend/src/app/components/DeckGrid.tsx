import Link from "next/link";
import React from "react";
import {Deck} from "@/types";

export const DeckGrid = ({decks}: {decks: Deck[]}) => {
	return (
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
	)
};