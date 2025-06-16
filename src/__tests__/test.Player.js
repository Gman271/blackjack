import { Player } from "../actors/Player.js";
import { Hand } from "../components/Hand.js";

// Mock card
const mockCard = (value = "T", countValue = 0) => ({
  value,
  countValue,
});

// Mock shoe for predictable draw()
class MockShoe {
  constructor() {
    this.cards = [
      mockCard("8"),
      mockCard("8"),
      mockCard("5"),
      mockCard("A"),
      mockCard("K"),
    ];
  }

  draw() {
    return this.cards.pop();
  }
}

describe("Player class", () => {
  let player;
  let shoe;

  beforeEach(() => {
    player = new Player(1000);
    shoe = new MockShoe();
  });

  test("initial state", () => {
    expect(player.bankroll).toBe(1000);
    expect(player.hands.length).toBe(1);
    expect(player.bets[0]).toBe(0);
    expect(player.getHand() instanceof Hand).toBe(true);
  });

  test("placeBet deducts bankroll and stores bet", () => {
    player.placeBet(200);
    expect(player.bankroll).toBe(800);
    expect(player.bets[0]).toBe(200);
  });

  test("addWinnings adds to bankroll", () => {
    player.addWinnings(300);
    expect(player.bankroll).toBe(1300);
  });

  test("resetHand resets hands and bets", () => {
    player.placeBet(100);
    player.getHand().addCard(mockCard("K"));
    player.resetHand();
    expect(player.hands.length).toBe(1);
    expect(player.bets[0]).toBe(0);
    expect(player.getHand().cards.length).toBe(0);
  });

  test("doubleDown doubles bet and draws card", () => {
    player.placeBet(100);
    const hand = player.getHand();
    hand.addCard(mockCard("9"));
    hand.addCard(mockCard("2"));

    player.doubleDown(shoe);

    expect(hand.cards.length).toBe(3);
    expect(player.bets[0]).toBe(200);
    expect(player.bankroll).toBe(800);
  });

  test("doubleDown throws if not enough bankroll", () => {
    player = new Player(100);
    player.placeBet(100);
    const hand = player.getHand();
    hand.addCard(mockCard("9"));
    hand.addCard(mockCard("2"));

    expect(() => {
      player.doubleDown(shoe);
    }).toThrow("Player has not enough chips!");
  });

  test("splitHand splits hand correctly", () => {
    player.placeBet(100);
    const hand = player.getHand();
    hand.addCard(mockCard("8"));
    hand.addCard(mockCard("8"));

    player.splitHand(shoe);

    expect(player.hands.length).toBe(2);
    expect(player.bets.length).toBe(2);
    expect(player.bankroll).toBe(800);

    const [hand1, hand2] = player.hands;
    expect(hand1.cards.length).toBe(2);
    expect(hand2.cards.length).toBe(2);
  });

  test("splitHand does nothing if not a pair", () => {
    const hand = player.getHand();
    hand.addCard(mockCard("8"));
    hand.addCard(mockCard("9"));
    player.placeBet(100);

    player.splitHand(shoe);

    expect(player.hands.length).toBe(1);
  });

  test("splitHand throws if not enough bankroll", () => {
    player = new Player(100);
    const hand = player.getHand();
    hand.addCard(mockCard("8"));
    hand.addCard(mockCard("8"));
    player.placeBet(100);

    expect(() => {
      player.splitHand(shoe);
    }).toThrow("Player has not enough chips!");
  });

  test("runningCount sums all hands", () => {
    const hand = player.getHand();
    hand.addCard({ value: "5", countValue: 1 });
    hand.addCard({ value: "T", countValue: -1 });

    expect(player.runningCount).toBe(0);
  });
});
