import React, {forwardRef} from "react";

type AddDeckFormProps = {
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	elementType: 'Deck' | 'Flashcard';
};

export const AddingForm = forwardRef<
	HTMLDivElement,
	AddDeckFormProps
>(({onSubmit, elementType}, ref) => {
	return (
		<div ref={ref} className="mt-8 items-center bg-gray-300 rounded-lg p-4"
		>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				{elementType === 'Flashcard' ?
					<>
						<input type="text"
							   name="question"
							   placeholder="Question"
							   required
							   className="border border-gray-400 px-4 py-2 rounded-lg"
						/>
						<input type="text"
							   name="answer"
							   placeholder="Answer"
							   required
							   className="border border-gray-400 px-4 py-2 rounded-lg"
						/>
					</>
					:
					<>

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
					</>
				}
				<button type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-lg"
				>
					Add {elementType}
				</button>
			</form>
		</div>
	)
		;
});

// Fix ESLint warning that 'Component definition is missing display name'. When
// using forwardRef, the component does not automatically receive a display
// name, making it harder to debug.
AddingForm.displayName = "AddingForm";