import { Dealer } from "../actors/Dealer.js";
import { Hand } from "../components/Hand.js";

describe("Dealer", () => {
  test("initializes with a Hand instance", () => {
    const dealer = new Dealer();
    expect(dealer.hand).toBeInstanceOf(Hand);
  });

  test("resetHand creates a new Hand", () => {
    const dealer = new Dealer();
    const original = dealer.hand;

    dealer.resetHand();

    expect(dealer.hand).toBeInstanceOf(Hand);
    expect(dealer.hand).not.toBe(original);
  });
});
