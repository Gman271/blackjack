import { Hand } from "../components/Hand.js";
import { Shoe } from "../components/Shoe.js";

describe("Hand class", () => {
  let shoe;

  beforeEach(() => {
    shoe = new Shoe(1);
  });

  test("initial state is correct", () => {
    const hand = new Hand();
    expect(hand.cards).toEqual([]);
    expect(hand.handValue).toBe(0);
    expect(hand.handType).toBe("hard");
    expect(hand.isSoft).toBe(false);
    expect(hand.isDoubled).toBe(false);
  });

  test("addCard adds card and updates hand", () => {
    const hand = new Hand();
    hand.addCard({ value: "5", countValue: 1 });
    expect(hand.cards.length).toBe(1);
    expect(hand.handValue).toBe(5);
    expect(hand.handType).toBe("hard");
  });

  test("addCard does not add if doubled and already has 3 cards", () => {
    const hand = new Hand();
    hand.isDoubled = true;
    hand.cards = [
      { value: "5", countValue: 1 },
      { value: "3", countValue: 1 },
      { value: "2", countValue: 1 },
    ];
    hand.addCard({ value: "K", countValue: -1 });
    expect(hand.cards.length).toBe(3); // Should not increase
  });

  test("doubleDown works and adds one card", () => {
    const hand = new Hand();
    hand.addCard({ value: "9", countValue: 0 });
    hand.addCard({ value: "2", countValue: 1 });

    const initialCardCount = hand.cards.length;
    hand.doubleDown(shoe);

    expect(hand.isDoubled).toBe(true);
    expect(hand.cards.length).toBe(initialCardCount + 1);
  });

  test("hasAce works correctly", () => {
    const hand = new Hand();
    hand.addCard({ value: "5", countValue: 1 });
    expect(hand.hasAce()).toBe(false);

    hand.addCard({ value: "A", countValue: -1 });
    expect(hand.hasAce()).toBe(true);
  });

  test("correctly identifies BlackJack", () => {
    const hand = new Hand();
    hand.addCard({ value: "A", countValue: -1 });
    hand.addCard({ value: "K", countValue: -1 });

    expect(hand.handValue).toBe(21);
    expect(hand.isBlackJack).toBe(true);
  });

  test("correctly identifies pair", () => {
    const hand = new Hand();
    hand.addCard({ value: "8", countValue: 0 });
    hand.addCard({ value: "8", countValue: 0 });

    expect(hand.handType).toBe("pair");
  });

  test("correctly identifies soft hand", () => {
    const hand = new Hand();
    hand.addCard({ value: "A", countValue: -1 });
    hand.addCard({ value: "6", countValue: 1 });

    expect(hand.isSoft).toBe(true);
    expect(hand.handType).toBe("soft");
    expect(hand.handValue).toBe(17);
  });

  test("correctly identifies hard hand with Ace counted as 1", () => {
    const hand = new Hand();
    hand.addCard({ value: "A", countValue: -1 });
    hand.addCard({ value: "9", countValue: 0 });
    hand.addCard({ value: "9", countValue: 0 });

    expect(hand.isSoft).toBe(false);
    expect(hand.handType).toBe("hard");
    expect(hand.handValue).toBe(19); // A = 1 here
  });

  test("runningCount returns correct value", () => {
    const hand = new Hand();
    hand.addCard({ value: "2", countValue: 1 });
    hand.addCard({ value: "T", countValue: -1 });
    hand.addCard({ value: "5", countValue: 1 });

    expect(hand.runningCount).toBe(1); // 1 - 1 + 1
  });
});
