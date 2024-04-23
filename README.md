# Flashcards

Flashcard application that allows users to:

- Create new decks
- Add flashcards to a deck
- Play through a deck, seeing one flashcard at a time
- Marking each flashcard as "remembered" or "not remembered"

The app is containerised using `docker-compose`, and includes some unit tests.

**Stack:** Typescript, Next.js (React), Tailwind CSS, Express.js (Node), MySQL

## Run

First, run the development server:

```bash
docker compose up
```

Open [http://localhost:3001](http://localhost:3001) with your browser and enjoy!
When you're done, you can stop the server with `Ctrl+C` or by running:
    
```bash
docker compose down
```
