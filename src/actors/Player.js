import { Hand } from "../components/Hand.js";

/**
 * The Player class models a blackjack player, including bankroll management,
 * hand control, and betting actions such as double down and split.
 */
export class Player {
  /**
   * Creates a new Player instance with a starting bankroll.
   * @param {number} bankroll - Initial amount of money the player has.
   */
  constructor(bankroll) {
    this.hands = [new Hand()];
    this.bankroll = bankroll;
    this.bets = [0];
  }

  /**
   * Calculates the running count from all the player's hands (used for card counting).
   * @returns {number}
   */
  get runningCount() {
    return this.hands.reduce((sum, hand) => sum + hand.runningCount, 0);
  }

  /**
   * Returns the hand at the specified index (used in splits).
   * @param {number} index - Index of the hand (default is 0).
   * @returns {Hand}
   */
  getHand(index = 0) {
    return this.hands[index];
  }

  /**
   * Places a bet on a specific hand and deducts it from the bankroll.
   * @param {number} amount - Amount to bet.
   * @param {number} index - Hand index (default is 0).
   */
  placeBet(amount, index = 0) {
    this.#deductBankroll(amount);
    this.bets[index] = amount;
  }

  /**
   * Adds winnings to the player's bankroll.
   * @param {number} amount - Amount won.
   */
  addWinnings(amount) {
    this.bankroll += amount;
  }

  /**
   * Resets the player's hands and bets to start a new round.
   */
  resetHand() {
    this.hands = [new Hand()];
    this.bets = [0];
  }

  /**
   * Performs a double down: deducts the same bet again and draws one card only.
   * @param {Shoe} shoe - The shoe to draw cards from.
   * @param {number} index - The hand index to double down (default is 0).
   */
  doubleDown(shoe, index = 0) {
    const hand = this.getHand(index);
    const bet = this.bets[index];

    this.#deductBankroll(bet);
    hand.doubleDown(shoe);
    this.bets[index] = bet * 2;
  }

  /**
   * Splits a pair into two separate hands if allowed, and places an additional bet.
   * @param {Shoe} shoe - The shoe to draw cards from.
   * @param {number} index - Index of the hand to split (default is 0).
   */
  splitHand(shoe, index = 0) {
    const hand = this.getHand(index);

    if (hand.handType !== "pair" || this.hands.length >= 4) return;

    const bet = this.bets[index];

    this.#deductBankroll(bet);

    const [card1, card2] = hand.cards;

    const newHand1 = createSplitHand(card1, shoe);
    const newHand2 = createSplitHand(card2, shoe);

    this.hands[index] = newHand1;
    this.hands.push(newHand2);
    this.bets.push(bet);
  }

  /**
   * Private method: deducts a given amount from the bankroll.
   * @param {number} amount - Amount to deduct.
   * @throws Will throw an error if the player doesn't have enough funds.
   */
  #deductBankroll(amount) {
    if (amount > this.bankroll) {
      throw new Error("Player has not enough chips!");
    }
    this.bankroll -= amount;
  }
}

/**
 * Helper function to create a new hand during split.
 * Adds the original card and draws one new card from the shoe.
 * @param {Object} card - Card to keep.
 * @param {Shoe} shoe - Shoe to draw the second card from.
 * @returns {Hand}
 */
function createSplitHand(card, shoe) {
  const hand = new Hand();
  hand.addCard(card);
  hand.addCard(shoe.draw());
  return hand;
}
