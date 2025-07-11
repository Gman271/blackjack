import { KELLY_MULTIPLIER } from "../conf.js";

/**
 * Represents a betting strategy based on the Kelly criterion.
 * This strategy adjusts the bet size based on the player's edge (true count).
 */
export class BetStrategy {
  /**
   * Constructs a new betting strategy instance.
   * @param {number} maxBet - The maximum allowed bet size (default: 10000).
   */
  constructor(maxBet = 10000) {
    /** @type {number} */
    this.maxBet = maxBet;
  }

  /**
   * Calculates the final bet amount based on true count and bankroll.
   * Applies rounding and enforces the maximum bet limit.
   * @param {number} trueCount - The current true count from card counting.
   * @param {number} bankroll - The player's current bankroll.
   * @returns {number} - The calculated bet amount.
   */
  getBet(trueCount, bankroll) {
    const optimal = this.getOptimalBet(trueCount, bankroll);
    const rounded =
      Math.floor(optimal / this.getBaseBet(bankroll)) *
      this.getBaseBet(bankroll);

    return Math.min(rounded, this.maxBet);
  }

  /**
   * Returns the base betting unit based on bankroll.
   * Used as a minimum increment for betting.
   * @param {number} bankroll
   * @returns {number}
   */
  getBaseBet(bankroll) {
    return bankroll / (50 * 12);
  }

  /**
   * Calculates the player's edge in percentage.
   * @param {number} trueCount
   * @returns {number} - The edge (in percent).
   */
  getEdge(trueCount) {
    return (trueCount - 1) * 0.5;
  }

  /**
   * Calculates the optimal bet percentage using the Kelly criterion.
   * @param {number} trueCount
   * @returns {number}
   */
  getOptimalPercent(trueCount) {
    return this.getEdge(trueCount) * KELLY_MULTIPLIER;
  }

  /**
   * Computes the optimal bet amount based on true count and bankroll.
   * Falls back to base bet if true count is below 2.
   * @param {number} trueCount
   * @param {number} bankroll
   * @returns {number}
   */
  getOptimalBet(trueCount, bankroll) {
    if (trueCount < 2) return this.getBaseBet(bankroll);

    return (bankroll / 100) * this.getOptimalPercent(trueCount);
  }
}
