import { Shoe } from "../components/Shoe.js";

describe("Shoe class", () => {
  let shoe;

  beforeEach(() => {
    shoe = new Shoe(1, 0.25);
  });

  test("initial shoe should contain 52 cards per deck", () => {
    expect(shoe.shoe.length).toBe(52 * shoe.numDecks);
  });

  test("remainingDecks returns correct value", () => {
    expect(shoe.remainingDecks).toBeCloseTo(1, 2);
    shoe.draw();
    expect(shoe.remainingDecks).toBeCloseTo((52 * shoe.numDecks - 1) / 52, 2);
  });

  test("draw() returns a card and reduces shoe length", () => {
    const initialLength = shoe.shoe.length;
    const card = shoe.draw();
    expect(card).toHaveProperty("suit");
    expect(card).toHaveProperty("value");
    expect(card).toHaveProperty("countValue");
    expect(shoe.shoe.length).toBe(initialLength - 1);
  });

  test("draw() sets reachedEndMarker when shoe length is at or below endMarkerIndex", () => {
    while (shoe.shoe.length > shoe.endMarkerIndex + 1) {
      shoe.draw();
      expect(shoe.reachedEndMarker).toBe(false);
    }

    expect(shoe.reachedEndMarker).toBe(false);

    shoe.draw();
    expect(shoe.reachedEndMarker).toBe(true);
  });

  test("draw() throws error if shoe is empty", () => {
    while (shoe.shoe.length > 0) {
      shoe.draw();
    }
    expect(() => shoe.draw()).toThrow("A shoe üres!");
  });
});
