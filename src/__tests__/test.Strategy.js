import { Strategy } from "../strategy/Strategy.js";
import { basicStrategy } from "../strategy/basicStrategy.js";

describe("Strategy", () => {
  describe("getDealerNextMove", () => {
    test("returns undefined if all player hands are busted", () => {
      const playerHands = [{ handValue: 22 }, { handValue: 25 }];
      const dealerHand = { handValue: 16 };
      expect(
        Strategy.getDealerNextMove(playerHands, dealerHand)
      ).toBeUndefined();
    });

    test("returns 'Hit' if dealer has soft 17 and hitOnSoft17 is true", () => {
      const playerHands = [{ handValue: 15 }];
      const dealerHand = { handValue: 17, isSoft: true };
      expect(Strategy.getDealerNextMove(playerHands, dealerHand)).toBe("Hit");
    });

    test("returns 'Hit' if dealer has less than 17", () => {
      const playerHands = [{ handValue: 10 }];
      const dealerHand = { handValue: 16, isSoft: false };
      expect(Strategy.getDealerNextMove(playerHands, dealerHand)).toBe("Hit");
    });

    test("returns 'Stand' if dealer has hard 17", () => {
      const playerHands = [{ handValue: 10 }];
      const dealerHand = { handValue: 17, isSoft: false };
      expect(Strategy.getDealerNextMove(playerHands, dealerHand)).toBe("Stand");
    });
  });

  describe("getPlayerNextMove", () => {
    test("returns 'Stand' if hand is doubled", () => {
      const playerHand = { isDoubled: true };
      expect(Strategy.getPlayerNextMove(playerHand, {})).toBe("Stand");
    });

    test("returns fallback 'Hit' if move is Double but hand has more than 2 cards", () => {
      const playerHand = {
        isDoubled: false,
        handValue: 18,
        handType: "soft",
        hasAce: () => true,
        cards: [{}, {}, {}],
      };
      const dealerHand = { upCardValue: 2 };
      expect(Strategy.getPlayerNextMove(playerHand, dealerHand)).toBe("Hit");
    });

    test("returns real strategy move if 2-card hand", () => {
      const playerHand = {
        isDoubled: false,
        handValue: 18,
        handType: "soft",
        hasAce: () => true,
        cards: [{}, {}],
      };
      const dealerHand = { upCardValue: 3 };
      expect(Strategy.getPlayerNextMove(playerHand, dealerHand)).toBe("Double");
    });
  });

  describe("determineMove", () => {
    test("returns 'Stand' if hand value >= 21", () => {
      const move = Strategy.determineMove({
        handValue: 21,
        handType: "hard",
        hasAce: false,
        dealerUpCard: "5",
      });
      expect(move).toBe("Stand");
    });

    test("routes to handlePair", () => {
      const move = Strategy.determineMove({
        handValue: 4,
        handType: "pair",
        hasAce: false,
        dealerUpCard: "2",
      });
      expect(move).toBe(basicStrategy.pair[4][2]);
    });

    test("routes to handleSoft", () => {
      const move = Strategy.determineMove({
        handValue: 18,
        handType: "soft",
        hasAce: true,
        dealerUpCard: "6",
      });
      expect(move).toBe(basicStrategy.soft[18][6]);
    });

    test("routes to handleHard", () => {
      const move = Strategy.determineMove({
        handValue: 12,
        handType: "hard",
        hasAce: false,
        dealerUpCard: "4",
      });
      expect(move).toBe(basicStrategy.hard[12][4]);
    });
  });

  describe("handlePair", () => {
    test("handles special 20 + hasAce case → Split", () => {
      const move = Strategy.handlePair(20, true, "6");
      expect(move).toBe("Split");
    });

    test("handles normal 20 → Stand", () => {
      const move = Strategy.handlePair(20, false, "6");
      expect(move).toBe("Stand");
    });

    test("returns value from table", () => {
      const move = Strategy.handlePair(10, false, "3");
      expect(move).toBe(basicStrategy.pair[10][3]);
    });
  });

  describe("handleSoft", () => {
    test("returns 'Stand' if handValue > 19", () => {
      const move = Strategy.handleSoft(20, "6");
      expect(move).toBe("Stand");
    });

    test("returns value from table", () => {
      const move = Strategy.handleSoft(17, "3");
      expect(move).toBe(basicStrategy.soft[17][3]);
    });
  });

  describe("handleHard", () => {
    test("returns 'Hit' if value < 9", () => {
      const move = Strategy.handleHard(8, "4");
      expect(move).toBe("Hit");
    });

    test("returns 'Stand' if value > 16", () => {
      const move = Strategy.handleHard(17, "2");
      expect(move).toBe("Stand");
    });

    test("returns value from table", () => {
      const move = Strategy.handleHard(12, "4");
      expect(move).toBe(basicStrategy.hard[12][4]);
    });
  });
});
