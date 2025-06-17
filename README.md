# 🃏 Blackjack Game Engine

A fully tested and modular JavaScript Blackjack game engine featuring dealer
logic, player logic, strategic decision-making, and support for multiple decks
with card counting.

---

## 📁 Project Structure

```
src/
├── actors/         # Player and Dealer logic
├── components/     # Core building blocks like Card, Shoe, Hand
├── game/           # Game engine logic and round management
├── strategy/       # Basic strategy implementation
├── index.js        # Entry point (if applicable)
tests/              # Jest test cases for all modules
```

---

## 🎯 Features

- ✅ Multi-deck Blackjack game logic
- 🧠 Basic strategy engine for player and dealer
- 🧪 Full unit test coverage using **Jest**
- 🔄 Supports reshuffling, splitting, doubling
- 👥 Clean modular structure

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blackjack-game.git
cd blackjack-game
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the game

If there's an entry point (e.g. `index.js`):

```bash
node src/index.js
```

Or use a defined npm script (e.g. `npm run start`).

---

## 🧪 Running Tests

The project uses **Jest**.

```bash
npm test
```

To generate a detailed coverage report:

```bash
npm run coverage
```

The HTML report is saved to:

```
coverage/index.html
```

Open that file in your browser for full results.

---

## 📊 Code Coverage Summary

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 98.26%   |
| Branches   | 95.23%   |
| Functions  | 95%      |
| Lines      | 98.54%   |

Generated using **Istanbul** (`jest --coverage`)

---

## 🧠 Core Logic Overview

### 🎮 `Game` Class

Located in: `src/game/Game.js`

Handles:

- Initial dealing
- Player and dealer turns
- Evaluating round outcome
- Running count logic
- Round resets and reshuffling

### 🧍 `Player` & `Dealer`

Located in: `src/actors/`

- Manage hands, actions, and decisions
- Player supports:
  - Splitting
  - Doubling
  - Multiple hands

### 🃏 `Shoe`, `Hand`, `Card`

Located in: `src/components/`

- `Shoe`: Builds and shuffles decks
- `Hand`: Tracks cards and calculates value
- `Card`: Basic card object with value/suit

### 📚 Strategy Engine

Located in: `src/strategy/Strategy.js`

- Implements **basic Blackjack strategy**
- Exposed functions:
  - `getPlayerNextMove()`
  - `getDealerNextMove()`

---

## 📦 NPM Scripts

Defined in `package.json`:

```json
"scripts": {
  "test": "jest",
  "coverage": "jest --coverage"
}
```

---

## 🔧 Dependencies

- `jest`: Unit testing framework

Install with:

```bash
npm install --save-dev jest
```

If using ES Modules (ESM), make sure to set:

```json
"type": "module"
```

In `package.json`

---

## 🙌 Contributing

Contributions are welcome!

- Fork the repo
- Open a PR
- Add test cases if you're changing logic

---

## 📄 License

MIT © 2025 Gergely Kristof Kovacs
