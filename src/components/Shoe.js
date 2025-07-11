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
  constructor(numDecks = 1, endMarkerRatio) {
    /** @type {number} */
    this.numDecks = numDecks;
    /** @type {Array<{suit: string, value: string, countValue: number}>} */
    this.shoe = [];
    /** @type {boolean} - True if the end marker (cut card) has been reached. */
    this.reachedEndMarker = false;
    /** Initialize and shuffle the shoe */
    this.initShoe();
    /**
     * Index where the cut card is placed.
     * Once the number of remaining cards drops below this index, the shoe should be reshuffled.
     */
    this.endMarkerIndex =
      this.shoe.length - Math.floor(this.shoe.length * endMarkerRatio);
  }

  /**
   * Gets the approximate number of decks remaining in the shoe.
   * @returns {number}
   */
  get remainingDecks() {
    return +(this.shoe.length / 52).toFixed(2);
  }

  /**
   * Initializes the shoe by combining the specified number of decks and shuffling them.
   */
  initShoe() {
    for (let i = 0; i < this.numDecks; i++) {
      const deck = new Deck();
      this.shoe.push(...deck.cards);
    }

    this.shuffle();
  }

  /**
   * Shuffles the shoe using Fisher-Yates algorithm.
   */
  shuffle() {
    for (let i = this.shoe.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.shoe[i], this.shoe[j]] = [this.shoe[j], this.shoe[i]];
    }
  }

  /**
   * Draws one card from the top of the shoe.
   * If the end marker is reached, sets the `reachedEndMarker` flag.
   * @returns {{suit: string, value: string, countValue: number}} - The drawn card.
   * @throws Will throw an error if the shoe is empty.
   */
  draw() {
    if (this.shoe.length === 0) throw new Error("A shoe üres!");

    const drawnCard = this.shoe.pop();

    if (this.shoe.length <= this.endMarkerIndex) this.reachedEndMarker = true;

    return drawnCard;
  }
}
