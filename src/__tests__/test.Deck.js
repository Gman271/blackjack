import { Deck } from "../components/Deck";

describe("Deck class", () => {
  let deck;

  beforeEach(() => {
    deck = new Deck();
  });

  test("deck should contain 52 cards", () => {
    expect(deck.cards.length).toBe(52);
  });

  test("each card should have suit, value, and countValue", () => {
    for (let card of deck.cards) {
      expect(card).toHaveProperty("suit");
      expect(card).toHaveProperty("value");
      expect(card).toHaveProperty("countValue");
    }
  });

  test("countValue should match Hi-Lo card counting system", () => {
    const expectedValues = {
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 0,
      8: 0,
      9: 0,
      T: -1,
      J: -1,
      Q: -1,
      K: -1,
      A: -1,
    };

    for (let card of deck.cards) {
      expect(card.countValue).toBe(expectedValues[String(card.value)]);
    }
  });
});
