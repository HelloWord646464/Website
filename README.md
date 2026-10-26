# PlayVault 🎮

A free games website with 23 games that run right in the browser. No accounts, no ads, no subscriptions, no servers. It's plain HTML, CSS and JavaScript, so you can host it anywhere for free.

## Games

| Arcade | Puzzle | Board & Cards | Learning |
|---|---|---|---|
| Snake | 2048 | Tic-Tac-Toe (vs CPU or 2 players) | Type Rush (typing) |
| Brick Breaker | Block Drop | Four in a Row (vs CPU or 2 players) | Math Rush (mental maths) |
| Sky Hop | Minesweeper | Solitaire (draw 1 / draw 3) | Word Guess (daily word) |
| Desert Dash | Sudoku | | Sudoku |
| Star Blaster | Memory Match | | |
| Space Rocks | Word Guess | | |
| Paddle Duel (vs CPU or 2 players) | Color Echo | | |
| Lane Racer | | | |
| Sky Jumper | | | |
| Tower Stack | | | |
| Whack-a-Mole | | | |

Every game works with a keyboard and mouse, and also on phones and tablets (touch, swipe or on-screen buttons).

**Site features:** search, categories, favourites ❤️, "continue playing", a game of the day, fullscreen, restart, a sound on/off button, and best scores saved on the device.

## Put it online for free

### Option A: GitHub Pages (simplest)

GitHub Pages is free for **public** repositories.

1. Merge this branch into `main`.
2. On GitHub, open the repo, then **Settings → General → Danger Zone → Change visibility → Public**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose **`main`** and **`/ (root)`**, then click **Save**.
4. After a minute or two the site is live at:
   **https://finleyinwood64-jpg.github.io/Website/**

### Option B: keep the repo private (Netlify or Cloudflare Pages)

Both have free plans that work with private repos:

- **Netlify:** sign in with GitHub, click **Add new site → Import an existing project**, pick this repo and branch. Leave the build command empty and set the publish directory to `/`, then deploy.
- **Cloudflare Pages:** **Workers & Pages → Create → Pages → Connect to Git**, pick the repo. Framework preset: *None*. Leave the build command empty and set the output directory to `/`.

Either one gives you a free `*.netlify.app` or `*.pages.dev` web address, and it updates automatically every time you push.

## Run it on your own computer

Some browser features don't work from `file://` pages, so serve the folder with a small local web server:

```bash
cd Website
python3 -m http.server 8000
# then open http://localhost:8000
```

## Change the site name

The name "PlayVault" appears in:

- `assets/js/catalog.js`: `SITE.name`
- `index.html` and `play.html`: the `<title>` and the logo text (`Play<b>Vault</b>`)

The logo image is `assets/img/logo.svg`.

## Add your own game

1. Create `games/<your-game-id>/index.html`. It can be any HTML5 game. To reuse the shared helpers (scaling, start/game-over screens, sounds, saved best scores), include `../shared/kit.css` and `../shared/kit.js` the way the other games do.
2. Add an entry to `window.GAMES` in `assets/js/catalog.js` with an `id`, `title`, `tags`, `aspect` (width ÷ height), `color`, `emoji`, `desc` and `how`.
3. Add a 480×300 thumbnail at `assets/thumbs/<your-game-id>.jpg`. If you skip this, the card shows the emoji instead.

## Folder layout

```
index.html          home page (search, categories, favourites)
play.html           game player page (fullscreen, restart, sound)
404.html            "page not found" page
assets/
  css/site.css      site styles
  js/catalog.js     list of games and categories
  js/site.js        favourites, recently played, game cards
  img/logo.svg      logo and favicon
  thumbs/           game thumbnails
games/
  shared/kit.js     helper library used by the games
  shared/kit.css
  <game-id>/index.html   one folder per game
```

All games are original code written for this site. Saved data (best scores, favourites, saved Sudoku and 2048 games) is kept in the browser's local storage on each device.
