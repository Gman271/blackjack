import { basicStrategy } from "./basicStrategy.js";

/**
 * Strategy class determines the optimal moves for both the dealer and the player
 * based on Blackjack basic strategy rules.
 */
export class Strategy {
  /**
   * Determines the dealer's next move (Hit or Stand).
   * Considers soft 17 rules and active player hands.
   * @param {Hand[]} playerHand - Array of player hands (in case of splits).
   * @param {Hand} dealerHand - The dealer's hand.
   * @param {boolean} hitOnSoft17 - Whether the dealer hits on soft 17.
   * @returns {"Hit" | "Stand" | undefined}
   */
  static getDealerNextMove(playerHand, dealerHand, hitOnSoft17 = true) {
    const activeHands = playerHand.filter((hand) => hand.handValue <= 21);

    if (activeHands.length === 0) return;

    if (hitOnSoft17 && dealerHand.handValue === 17 && dealerHand.isSoft)
      return "Hit";

    return dealerHand.handValue < 17 ? "Hit" : "Stand";
  }

  /**
   * Determines the player's next move based on their hand and dealer's up card.
   * Uses basic strategy and adjusts for conditions like doubling.
   * @param {Hand} playerHand - The player's current hand.
   * @param {Hand} dealerHand - The dealer's hand.
   * @returns {"Hit" | "Stand" | "Double" | "Split"}
   */
  static getPlayerNextMove(playerHand, dealerHand) {
    if (playerHand.isDoubled) return "Stand";

    let nextMove = this.determineMove({
      handValue: String(playerHand.handValue),
      handType: playerHand.handType,
      hasAce: playerHand.hasAce(),
      dealerUpCard: String(dealerHand.upCardValue),
    });

    if (nextMove === "Double" && playerHand.cards.length > 2) nextMove = "Hit";

    return nextMove;
  }

  /**
   * Determines move based on the hand type.
   * @param {Object} options
   * @param {string} options.handValue
   * @param {string} options.handType - "hard", "soft", or "pair"
   * @param {boolean} options.hasAce
   * @param {string} options.dealerUpCard
   * @returns {"Hit" | "Stand" | "Double" | "Split"}
   */
  determineMove({ handValue, handType, hasAce, dealerUpCard }) {
    if (handValue >= 21) return "Stand";

    if (handType === "pair")
      return this.handlePair(handValue, hasAce, dealerUpCard);

    if (handType === "soft") return this.handleSoft(handValue, dealerUpCard);

    return this.handleHard(handValue, dealerUpCard);
  }

  /**
   * Returns the recommended move for a pair hand based on basic strategy.
   * @param {number} handValue
   * @param {boolean} hasAce
   * @param {string} dealerUpCard
   * @returns {"Hit" | "Stand" | "Double" | "Split"}
   */
  handlePair(handValue, hasAce, dealerUpCard) {
    if (handValue === 4 || handValue === 6 || handValue === 14)
      return basicStrategy.pair[4]?.[dealerUpCard];

    if ((handValue === 20 && hasAce) || handValue === 16) return "Split";

    if (handValue === 20) return "Stand";

    return basicStrategy.pair[handValue]?.[dealerUpCard];
  }

  /**
   * Returns the recommended move for a soft hand.
   * @param {number} handValue
   * @param {string} dealerUpCard
   * @returns {"Hit" | "Stand" | "Double"}
   */
  handleSoft(handValue, dealerUpCard) {
    if (handValue > 19) return "Stand";

    return basicStrategy.soft[handValue]?.[dealerUpCard];
  }

  /**
   * Returns the recommended move for a hard hand.
   * @param {number} handValue
   * @param {string} dealerUpCard
   * @returns {"Hit" | "Stand" | "Double"}
   */
  handleHard(handValue, dealerUpCard) {
    if (handValue < 9) return "Hit";

    if (handValue > 16) return "Stand";

    return basicStrategy.hard[handValue]?.[dealerUpCard];
  }
}
