import { SUITS, VALUES } from "./conf.js";

class Deck {
  constructor(suits, values) {
    this.cards = [];
    for (let suit of suits) {
      for (let value of values) {
        this.cards.push({ suit, value, countValue: this.assignValues(value) });
      }
    }
    this.assignValues();
  }

  assignValues(value) {
    switch (value) {
      case "A":
        return [-1, 1];
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        return [1];
      case "7":
      case "8":
      case "9":
        return [0];

      default:
        return [-1];
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop();
  }
}

export default new Deck(SUITS, VALUES);
