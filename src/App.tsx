import { useCallback, useEffect, useState } from 'react';
import words from './wordList.json';
import { HangmanDrawing } from './components/HangmanDrawing';
import { HangmanWord } from './components/HangmanWord';
import { Keyboard } from './components/Keyboard';

function getWord() {
	return words[Math.floor(Math.random() * words.length)];
}

function App() {
	const [wordToGuess, setWordToGuess] = useState(getWord);
	const [guessedLetters, setGuessedLetter] = useState<string[]>([]);
	const inCorrectLetters = guessedLetters.filter(
		(letter) => !wordToGuess.includes(letter)
	);

	const isLoser = inCorrectLetters.length >= 6;
	const isWinner = wordToGuess
		.split('')
		.every((letter) => guessedLetters.includes(letter));

	const addGuessedLetter = useCallback(
		(letter: string) => {
			if (guessedLetters.includes(letter) || isLoser || isWinner) return;
			setGuessedLetter((currentLetters) => [...currentLetters, letter]);
		},
		[guessedLetters, isLoser, isWinner]
	);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;

			if (!key.match(/^[a-z]$/)) return;

			e.preventDefault();
			addGuessedLetter(key);
		};
		document.addEventListener('keypress', handler);

		return () => {
			document.removeEventListener('keypress', handler);
		};
	}, [guessedLetters]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;

			if (key !== 'Enter') return;
			e.preventDefault();
			setGuessedLetter([]);
			setWordToGuess(getWord());
		};
		document.addEventListener('keypress', handler);

		return () => {
			document.removeEventListener('keypress', handler);
		};
	}, []);

	return (
		<><div style={{ fontSize: '2rem', textAlign: 'center' }}>
				{isWinner && 'Winner! - Refresh to try again'}
				{isLoser && 'Nice Try - Refresh to try again'}
			</div>
			
			<div
				style={{
					display: 'flex',
					gap: '5rem',
					margin: '0 auto',
					padding: '4rem',
					justifyContent: 'center'
				}}
			>
				<HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '2rem',
						minWidth: '50vw',
						alignItems: 'center',
					}}
				>
					<HangmanWord
						reveal={isLoser}
						guessedLetters={guessedLetters}
						wordToGuess={wordToGuess}
					/>

					<div style={{ alignSelf: 'stretch' }}>
						<Keyboard
							disabled={isWinner || isLoser}
							activeLetters={guessedLetters.filter((letter) =>
								wordToGuess.includes(letter)
							)}
							inactiveLetters={inCorrectLetters}
							addGuessedLetters={addGuessedLetter}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
