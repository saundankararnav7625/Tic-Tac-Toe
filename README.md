# Tic-Tac-Toe

Play tic-tac-toe against the computer. You are X and go first. Pick a difficulty:

- **Easy:** the computer plays random moves, so you can win.
- **Hard:** the computer uses the minimax algorithm and never loses. The best you can do is a draw.

A scoreboard tracks your wins, the computer's wins, and draws for the session.

Built with plain HTML, CSS, and JavaScript. No libraries, no build step.

## Play it

1. Download or clone this repo.
2. Open `index.html` in your browser.

## How it works

- The board is an array of 9 items. Every possible win is listed in `WINNING_LINES`.
- **Easy** picks a random empty square.
- **Hard** uses minimax. For each square it could take, the computer plays out every possible game from there, assuming you always reply with your best move. It picks the square with the best result. I tested this by checking every possible way to play against it: you can never win.

## Files

- `index.html`: page structure
- `style.css`: layout and styling
- `script.js`: game rules, computer opponent, and page updates

## Ideas for next steps

- Let the player choose X or O, or let the computer go first
- Add a Medium level: win if possible, block if needed, otherwise random
- Add a two-player mode
- Add sound effects or a small animation when someone wins

## Live demo

Add your GitHub Pages link here once it's published.
