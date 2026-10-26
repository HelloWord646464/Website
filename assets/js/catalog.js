/* The list of games shown on the site.
   To add a game: put it in games/<id>/index.html, add an entry here,
   and drop a thumbnail at assets/thumbs/<id>.jpg. */
window.SITE = {
  name: 'PlayVault',
  tagline: 'Free games that run right in your browser'
};

window.CATEGORIES = [
  { id: 'all', label: 'All games', icon: '🎮' },
  { id: 'arcade', label: 'Arcade', icon: '👾' },
  { id: 'puzzle', label: 'Puzzle', icon: '🧩' },
  { id: 'board', label: 'Board & Cards', icon: '🃏' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: '2p', label: '2 Players', icon: '👥' },
  { id: 'favs', label: 'Favourites', icon: '❤️' }
];

/* aspect = width / height of the game, used to size the player window */
window.GAMES = [
  {
    id: 'snake', title: 'Snake', tags: ['arcade'], aspect: 0.91, color: '#4ade80', emoji: '🐍',
    desc: 'Eat apples, grow longer and don\'t bite your own tail.',
    how: 'Arrow keys or WASD to steer. Swipe on touch screens. P to pause.'
  },
  {
    id: '2048', title: '2048', tags: ['puzzle'], aspect: 0.81, color: '#facc15', emoji: '🔢',
    desc: 'Slide and merge matching numbers to reach the 2048 tile.',
    how: 'Arrow keys or WASD to slide tiles. Swipe on touch screens. Your game is saved automatically.'
  },
  {
    id: 'block-drop', title: 'Block Drop', tags: ['puzzle', 'arcade'], aspect: 0.81, color: '#a855f7', emoji: '🧱',
    desc: 'Rotate falling blocks and clear lines in this classic puzzle.',
    how: '← → move, ↑ rotate, ↓ soft drop, Space hard drop, C hold. Touch: drag to move, tap to rotate, flick down to drop.'
  },
  {
    id: 'brick-breaker', title: 'Brick Breaker', tags: ['arcade'], aspect: 1.33, color: '#f97316', emoji: '🧱',
    desc: 'Smash every brick with your paddle and catch power-ups.',
    how: 'Move with the mouse, your finger or ← →. Click or Space to launch the ball.'
  },
  {
    id: 'sky-hop', title: 'Sky Hop', tags: ['arcade'], aspect: 0.625, color: '#38bdf8', emoji: '🐤',
    desc: 'Flap through the gaps between the pipes. One tap at a time!',
    how: 'Space, ↑, click or tap to flap.'
  },
  {
    id: 'desert-dash', title: 'Desert Dash', tags: ['arcade'], aspect: 2.2, color: '#f59e0b', emoji: '🦊',
    desc: 'Run, jump and duck across the desert as the speed keeps rising.',
    how: 'Space or ↑ to jump (hold for higher), ↓ to duck. Touch: tap to jump, hold the ⬇ button to duck.'
  },
  {
    id: 'star-blaster', title: 'Star Blaster', tags: ['arcade'], aspect: 0.667, color: '#818cf8', emoji: '🚀',
    desc: 'Blast waves of alien ships, grab power-ups and beat the bosses.',
    how: 'Arrow keys or WASD to fly — your ship fires by itself. Mouse/touch: drag anywhere to fly.'
  },
  {
    id: 'space-rocks', title: 'Space Rocks', tags: ['arcade'], aspect: 1.33, color: '#22d3ee', emoji: '☄️',
    desc: 'Pilot your ship and shoot the space rocks before they hit you.',
    how: '← → turn, ↑ thrust, Space fire, H hyperspace. On-screen buttons on touch screens.'
  },
  {
    id: 'paddle-duel', title: 'Paddle Duel', tags: ['arcade', '2p'], aspect: 1.6, color: '#f472b6', emoji: '🏓',
    desc: 'Classic table-tennis showdown. Play the computer or a friend.',
    how: 'vs CPU: W/S, ↑/↓ or mouse. 2 players: left W/S, right ↑/↓. First to 7 wins.'
  },
  {
    id: 'lane-racer', title: 'Lane Racer', tags: ['arcade'], aspect: 0.6, color: '#ef4444', emoji: '🏎️',
    desc: 'Weave through traffic at ever-faster speeds and collect coins.',
    how: '← → or A/D to steer. Touch: hold the left or right side of the screen.'
  },
  {
    id: 'sky-jumper', title: 'Sky Jumper', tags: ['arcade'], aspect: 0.625, color: '#a3e635', emoji: '👽',
    desc: 'Bounce up from platform to platform. How high can you go?',
    how: '← → or A/D to move. Touch: hold the left or right side of the screen.'
  },
  {
    id: 'tower-stack', title: 'Tower Stack', tags: ['arcade'], aspect: 0.57, color: '#fb7185', emoji: '🏗️',
    desc: 'Drop each sliding block to build the tallest tower you can.',
    how: 'Space, click or tap to drop the block. Perfect drops in a row grow your block back.'
  },
  {
    id: 'whack-a-mole', title: 'Whack-a-Mole', tags: ['arcade'], aspect: 0.91, color: '#84cc16', emoji: '🔨',
    desc: 'Bop the moles as fast as you can — but don\'t hit the bombs!',
    how: 'Click or tap the moles. Keyboard: Q W E / A S D / Z X C or the number pad.'
  },
  {
    id: 'minesweeper', title: 'Minesweeper', tags: ['puzzle'], aspect: 1.1, color: '#60a5fa', emoji: '💣',
    desc: 'Clear the field without setting off a single mine.',
    how: 'Click to dig, right-click or long-press to flag. Click a number to open around it. Three difficulties.'
  },
  {
    id: 'sudoku', title: 'Sudoku', tags: ['puzzle', 'learning'], aspect: 0.8, color: '#93c5fd', emoji: '9️⃣',
    desc: 'Fill the grid so every row, column and box has 1 to 9.',
    how: 'Pick a square, then a number. Arrow keys + number keys work too. N toggles notes, H gives a hint.'
  },
  {
    id: 'memory-match', title: 'Memory Match', tags: ['puzzle'], aspect: 1.0, color: '#c084fc', emoji: '🃏',
    desc: 'Flip the cards and find all the matching animal pairs.',
    how: 'Click or tap two cards to flip them. Find every pair in as few moves as you can.'
  },
  {
    id: 'word-guess', title: 'Word Guess', tags: ['puzzle', 'learning'], aspect: 0.8, color: '#22c55e', emoji: '🔤',
    desc: 'Guess the hidden 5-letter word in six tries. New daily word!',
    how: 'Type your guess and press Enter. Green = right spot, yellow = wrong spot, grey = not in the word.'
  },
  {
    id: 'color-echo', title: 'Color Echo', tags: ['puzzle'], aspect: 0.9, color: '#facc15', emoji: '🎵',
    desc: 'Watch the colours light up, then repeat the pattern back.',
    how: 'Click or tap the pads, or use Q W A S.'
  },
  {
    id: 'tic-tac-toe', title: 'Tic-Tac-Toe', tags: ['board', '2p'], aspect: 0.85, color: '#22d3ee', emoji: '❌',
    desc: 'Get three in a row. Can you beat the computer on Hard?',
    how: 'Click a square or press 1–9. Choose Easy, Medium, Hard or 2 Players.'
  },
  {
    id: 'four-in-a-row', title: 'Four in a Row', tags: ['board', '2p'], aspect: 0.94, color: '#2563eb', emoji: '🔴',
    desc: 'Drop discs and connect four before your opponent does.',
    how: 'Click a column or press 1–7. Play the computer or a friend.'
  },
  {
    id: 'solitaire', title: 'Solitaire', tags: ['board'], aspect: 1.3, color: '#16a34a', emoji: '♠️',
    desc: 'The classic patience card game. Draw 1 or draw 3.',
    how: 'Drag cards, or tap a card to move it automatically. Click the deck to draw. Undo any time.'
  },
  {
    id: 'type-rush', title: 'Type Rush', tags: ['learning', 'arcade'], aspect: 1.33, color: '#6366f1', emoji: '⌨️',
    desc: 'Type the falling words before they hit the city!',
    how: 'Just type each word. Start with its first letter to lock on.'
  },
  {
    id: 'math-rush', title: 'Math Rush', tags: ['learning', 'puzzle'], aspect: 0.9, color: '#14b8a6', emoji: '➗',
    desc: 'Answer as many sums as you can before the clock runs out.',
    how: 'Tap an answer or press 1–4. Right answers add time, wrong ones take it away.'
  }
];
