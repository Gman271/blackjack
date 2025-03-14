import { Deck } from "./Deck.js";

export class Shoe {
  constructor(numDecks = 1, endMarkerRatio = 1) {
    this.numDecks = numDecks;
    this.shoe = [];
    this.endMarkerIndex = Math.floor(numDecks * 52 * endMarkerRatio);
    this.initShoe();
  }

  initShoe() {
    for (let i = 0; i < this.numDecks; i++) {
      const deck = new Deck();
      this.shoe.push(...deck.cards);
    }

    this.shuffle();
  }

  shuffle() {
    for (let i = this.shoe.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.shoe[i], this.shoe[j]] = [this.shoe[j], this.shoe[i]];
    }
  }
}
