import { BetStrategy } from "../strategy/BetStrategy.js";
import { KELLY_MULTIPLIER } from "../conf.js";

describe("BetStrategy", () => {
  const bankroll = 12000; // fix bankroll a számításokhoz
  const strategy = new BetStrategy(1000); // maxBet: 1000

  test("getBaseBet returns bankroll / (50 * 12)", () => {
    expect(strategy.getBaseBet(bankroll)).toBe(bankroll / 600);
  });

  test("getEdge returns (trueCount - 1) * 0.5", () => {
    expect(strategy.getEdge(1)).toBe(0); // neutral
    expect(strategy.getEdge(2)).toBe(0.5); // slight edge
    expect(strategy.getEdge(4)).toBe(1.5); // strong edge
  });

  test("getOptimalPercent returns edge * KELLY_MULTIPLIER", () => {
    const trueCount = 3;
    const edge = strategy.getEdge(trueCount); // (3 - 1) * 0.5 = 1.0
    expect(strategy.getOptimalPercent(trueCount)).toBe(edge * KELLY_MULTIPLIER);
  });

  test("getOptimalBet returns base bet if trueCount < 2", () => {
    const lowCount = 1;
    expect(strategy.getOptimalBet(lowCount, bankroll)).toBe(
      strategy.getBaseBet(bankroll)
    );
  });

  test("getOptimalBet returns calculated Kelly % of bankroll if trueCount >= 2", () => {
    const trueCount = 4;
    const expected = (bankroll / 100) * strategy.getOptimalPercent(trueCount);
    expect(strategy.getOptimalBet(trueCount, bankroll)).toBe(expected);
  });

  test("getBet returns rounded multiple of base bet, capped at maxBet", () => {
    const trueCount = 5;
    const baseBet = strategy.getBaseBet(bankroll);
    const optimal = strategy.getOptimalBet(trueCount, bankroll);

    const rounded = Math.floor(optimal / baseBet) * baseBet;
    const expected = Math.min(rounded, strategy.maxBet);

    expect(strategy.getBet(trueCount, bankroll)).toBe(expected);
  });

  test("getBet returns base bet if trueCount < 2", () => {
    const trueCount = 1;
    const expected = strategy.getBaseBet(bankroll);
    expect(strategy.getBet(trueCount, bankroll)).toBe(expected);
  });

  test("getBet respects maxBet cap", () => {
    const highTrueCount = 10;
    const strategyWithLowCap = new BetStrategy(50);
    const bet = strategyWithLowCap.getBet(highTrueCount, bankroll);
    expect(bet).toBeLessThanOrEqual(50);
  });
});
