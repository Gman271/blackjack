import { SUITS, VALUES } from "../conf.js";

export class Deck {
  constructor(suits = SUITS, values = VALUES) {
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
}
