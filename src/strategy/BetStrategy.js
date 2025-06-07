import { KELLY_MULTIPLIER } from "../conf.js";

export class BetStrategy {
  constructor(maxBet = 10000) {
    this.maxBet = maxBet;
  }

  getBet(trueCount, bankroll) {
    const optimal = this.getOptimalBet(trueCount, bankroll);
    const rounded =
      Math.floor(optimal / this.getBaseBet(bankroll)) *
      this.getBaseBet(bankroll);

    return Math.min(rounded, this.maxBet);
  }

  getBaseBet(bankroll) {
    return bankroll / (50 * 12);
  }

  getEdge(trueCount) {
    return (trueCount - 1) * 0.5;
  }

  getOptimalPercent(trueCount) {
    return this.getEdge(trueCount) * KELLY_MULTIPLIER;
  }

  getOptimalBet(trueCount, bankroll) {
    if (trueCount < 2) return this.getBaseBet(bankroll);

    return (bankroll / 100) * this.getOptimalPercent(trueCount);
  }
}
