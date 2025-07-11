import { SUITS, VALUES } from "/../conf.js";

/**
 * Represents a standard deck of playing cards used in blackjack.
 * Generates cards with suit, value, and a counting value (used for card counting strategies).
 */
export class Deck {
  /**
   * Creates a new deck of cards.
   * Each card is an object containing:
   * - `suit`: the suit of the card (e.g. Hearts, Spades, etc.)
   * - `value`: the face value (e.g. "2", "J", "A", etc.)
   * - `countValue`: the value used for Hi-Lo card counting strategy.
   *
   * @param {string[]} [suits=SUITS] - An array of suits to use in the deck.
   * @param {string[]} [values=VALUES] - An array of values to use in the deck.
   */
  constructor(suits = SUITS, values = VALUES) {
    /**
     * The array of card objects in the deck.
     * @type {{suit: string, value: string, countValue: number}[]}
     */
    this.cards = [];

    for (let suit of suits) {
      for (let value of values) {
        this.cards.push({ suit, value, countValue: this.assignValues(value) });
      }
    }
  }

  /**
   * Assigns a count value to a card based on its face value,
   * according to the Hi-Lo counting system used in blackjack.
   *
   * - 2–6 → +1 (favorable for player)
   * - 7–9 → 0 (neutral)
   * - 10–A → -1 (favorable for dealer)
   *
   * @param {string|number} value - The face value of the card.
   * @returns {number} The count value for card counting.
   */
  assignValues(value) {
    switch (String(value)) {
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        return 1;
      case "7":
      case "8":
      case "9":
        return 0;
      default:
        return -1;
    }
  }
}
