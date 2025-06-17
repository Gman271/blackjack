import { Deck } from "./Deck.js";

/**
 * The Shoe class represents a shuffled stack of cards composed of multiple decks.
 * It is used for Blackjack games, where the shoe is reshuffled after reaching the cut card.
 */
export class Shoe {
  /**
   * Constructs a new Shoe instance
   * @param {number} numDecks - Number of decks to include in the shoe
   * @param {number} endMarkerRatio - Ratio indicating when the cut card is placed (e.g., 0.75 means 75% of the shoe will be played).
   */
  constructor(numDecks = 1, endMarkerRatio = 0.25) {
    this.numDecks = numDecks;
    this.shoe = [];
    this.endMarkerIndex = Math.floor(numDecks * 52 * endMarkerRatio);
    this.reachedEndMarker = false;
    this.initShoe();
  }

  get remainingDecks() {
    return +(this.shoe.length / 52).toFixed(2);
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

  draw() {
    if (this.shoe.length === 0) throw new Error("A shoe üres!");

    const drawnCard = this.shoe.pop();

    if (this.shoe.length <= this.endMarkerIndex) this.reachedEndMarker = true;

    return drawnCard;
  }
}
