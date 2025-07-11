/**
 * Represents a player's or dealer's hand in a game of Blackjack.
 * Manages the cards, calculates hand value, and tracks hand type (hard, soft, pair).
 */
export class Hand {
  constructor() {
    /** @type {Array<{suit: string, value: string, countValue: number}>} */
    this.cards = [];
    /** Total value of the hand, accounting for aces as 1 or 11 */
    this.handValue = 0;
    /** Type of hand: "hard", "soft", or "pair" */
    this.handType = "hard";
    /** Whether the hand has been doubled down */
    this.isDoubled = false;
    /** Whether the hand is soft (contains an ace counted as 11) */
    this.isSoft = false;
  }

  /**
   * Gets the value of the first (up) card in the hand.
   * Useful for dealer logic or strategy decision-making.
   */
  get upCardValue() {
    return getCardValue(this.cards[0]?.value);
  }

  /**
   * Calculates the running count value of the hand for card counting.
   * Uses Hi-Lo system values via card.countValue.
   */
  get runningCount() {
    return this.cards.reduce((sum, card) => sum + card.countValue, 0);
  }

  /**
   * Determines if the hand is a Blackjack (only two cards totaling 21).
   */
  get isBlackJack() {
    return this.cards.length === 2 && this.handValue === 21;
  }

  /**
   * Adds a new card to the hand and updates its value.
   * Prevents adding more than one card after doubling.
   * @param {{suit: string, value: string, countValue: number}} card
   */
  addCard(card) {
    if (this.isDoubled && this.cards.length >= 3) return;
    this.cards.push(card);
    this.updateHand();
  }

  /**
   * Performs a double down: doubles the bet and adds exactly one card.
   * @param {Object} shoe - The shoe object with a draw() method
   */
  doubleDown(shoe) {
    if (this.cards.length === 2) {
      this.isDoubled = true;
      this.addCard(shoe.draw());
    }
  }

  /**
   * Checks if the hand contains an Ace.
   * @returns {boolean}
   */
  hasAce() {
    return this.cards.some((card) => card.value === "A");
  }

  /**
   * Updates the total hand value and its type (soft, hard, pair).
   * Handles Ace logic to avoid busting (Ace = 11 or 1).
   */
  updateHand() {
    let sum = 0;
    let aceCount = 0;

    for (const card of this.cards) {
      const val = getCardValue(card.value);
      if (val === 11) aceCount++;
      sum += val;
    }

    while (sum > 21 && aceCount > 0) {
      sum -= 10;
      aceCount--;
    }

    this.handValue = sum;
    this.isSoft = this.hasAce() && sum <= 21 && aceCount > 0;

    if (
      this.cards.length === 2 &&
      this.cards[0].value === this.cards[1].value
    ) {
      this.handType = "pair";
    } else if (this.isSoft) {
      this.handType = "soft";
    } else {
      this.handType = "hard";
    }
  }
}

/**
 * Returns the numerical value of a card used for hand calculation.
 * @param {string} value - Card face value (e.g., "2", "A", "K")
 * @returns {number} - Blackjack numerical value
 */
function getCardValue(value) {
  if (value === "A") return 11;
  if (["K", "Q", "J", "T"].includes(value)) return 10;
  return +value;
}
