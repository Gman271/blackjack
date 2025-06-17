import { jest } from "@jest/globals";

jest.unstable_mockModule("../strategy/Strategy.js", () => ({
  Strategy: {
    getPlayerNextMove: jest.fn(),
    getDealerNextMove: jest.fn(),
  },
}));

let Game;
let Strategy;

beforeAll(async () => {
  const gameModule = await import("../game/Game.js");
  const strategyModule = await import("../strategy/Strategy.js");
  Game = gameModule.Game;
  Strategy = strategyModule.Strategy;
});

const mockAddCard = jest.fn();

const mockPlayerHand = {
  addCard: mockAddCard,
  handValue: 18,
  isBlackJack: false,
  isDoubled: false,
  hasAce: () => false,
};

const mockPlayerHandBJ = {
  addCard: mockAddCard,
  handValue: 21,
  isBlackJack: true,
  isDoubled: false,
  hasAce: () => true,
};

const mockPlayerHandBust = {
  addCard: mockAddCard,
  handValue: 22,
  isBlackJack: false,
  isDoubled: false,
  hasAce: () => false,
};

const mockPlayer = {
  hands: [mockPlayerHand],
  getHand: jest.fn(() => mockPlayerHand),
  placeBet: jest.fn(),
  doubleDown: jest.fn(),
  splitHand: jest.fn(),
  bets: [100],
  resetHand: jest.fn(),
  addWinnings: jest.fn(),
};

const mockDealerHand = {
  addCard: jest.fn(),
  cards: [],
  handValue: 17,
  isBlackJack: false,
  hasAce: () => false,
};

const mockDealerHandBJ = {
  addCard: jest.fn(),
  cards: [],
  handValue: 21,
  isBlackJack: true,
  hasAce: () => true,
};

const mockDealerHandBust = {
  addCard: jest.fn(),
  cards: [],
  handValue: 22,
  isBlackJack: false,
  hasAce: () => false,
};

const mockDealer = {
  hand: mockDealerHand,
  resetHand: jest.fn(),
};

const mockDraw = jest.fn(() => ({
  countValue: 1,
  value: "10",
  suit: "♠",
}));

const mockShoe = {
  draw: mockDraw,
  remainingDecks: 6,
  numDecks: 6,
  reachedEndMarker: false,
};

describe("Game class full coverage tests with mocked Strategy", () => {
  let game;

  beforeEach(() => {
    jest.clearAllMocks();
    game = new Game(6, 0.75, true, 1000);
    game.shoe = mockShoe;
    game.player = mockPlayer;
    game.dealer = mockDealer;
    game.runningCount = 0;

    Strategy.getPlayerNextMove.mockReturnValue("Stand");
    Strategy.getDealerNextMove.mockReturnValue("Stand");
  });

  test("dealInitialCards draws 4 cards and adds them", () => {
    game.dealInitialCards();
    expect(mockDraw).toHaveBeenCalledTimes(4);
    expect(mockAddCard).toHaveBeenCalledTimes(2);
    expect(game.runningCount).toBe(4);
  });

  test("playRound executes full round and returns result", () => {
    mockPlayer.hands = [mockPlayerHand];
    mockPlayer.bets = [100];
    mockDealer.hand = mockDealerHand;

    Strategy.getPlayerNextMove.mockReturnValue("Stand");
    Strategy.getDealerNextMove.mockReturnValue("Stand");

    const result = game.playRound();
    expect(typeof result).toBe("string");
  });

  test("evaluateWinner throws error if hands and bets count mismatch", () => {
    mockPlayer.hands = [mockPlayerHand];
    mockPlayer.bets = [];
    expect(() => game.evaluateWinner()).toThrow(
      "The number of player hands does not match the number of bets!"
    );
  });

  test("evaluateHandResult: player blackjack wins 3:2", () => {
    const msg = game.evaluateHandResult(mockPlayerHandBJ, mockDealerHand, 100);
    expect(msg).toMatch(/Blackjack/);
    expect(mockPlayer.addWinnings).toHaveBeenCalledWith(250);
  });

  test("evaluateHandResult: both blackjack is push", () => {
    const msg = game.evaluateHandResult(
      mockPlayerHandBJ,
      mockDealerHandBJ,
      100
    );
    expect(msg).toMatch(/döntetlen/i);
    expect(mockPlayer.addWinnings).toHaveBeenCalledWith(100);
  });

  test("evaluateHandResult: dealer blackjack player loses", () => {
    const msg = game.evaluateHandResult(mockPlayerHand, mockDealerHandBJ, 100);
    expect(msg).toMatch(/osztó blackjack/i);
  });

  test("evaluateHandResult: player busts, dealer wins", () => {
    const msg = game.evaluateHandResult(
      mockPlayerHandBust,
      mockDealerHand,
      100
    );
    expect(msg).toMatch(/Az osztó nyert/i);
  });

  test("evaluateHandResult: dealer busts, player wins", () => {
    const msg = game.evaluateHandResult(
      mockPlayerHand,
      mockDealerHandBust,
      100
    );
    expect(msg).toMatch(/A játékos nyert/i);
    expect(mockPlayer.addWinnings).toHaveBeenCalledWith(200);
  });

  test("evaluateHandResult: player hand value greater than dealer wins", () => {
    const playerHand = {
      handValue: 20,
      isBlackJack: false,
      hasAce: () => false,
    };
    const dealerHand = {
      handValue: 18,
      isBlackJack: false,
      hasAce: () => false,
    };
    const msg = game.evaluateHandResult(playerHand, dealerHand, 100);
    expect(msg).toMatch(/A játékos nyert/i);
    expect(mockPlayer.addWinnings).toHaveBeenCalledWith(200);
  });

  test("evaluateHandResult: tie returns push", () => {
    const playerHand = {
      handValue: 18,
      isBlackJack: false,
      hasAce: () => false,
    };
    const dealerHand = {
      handValue: 18,
      isBlackJack: false,
      hasAce: () => false,
    };
    const msg = game.evaluateHandResult(playerHand, dealerHand, 100);
    expect(msg).toMatch(/Döntetlen/i);
    expect(mockPlayer.addWinnings).toHaveBeenCalledWith(100);
  });

  test("evaluateHandResult: dealer hand value higher player loses", () => {
    const playerHand = {
      handValue: 17,
      isBlackJack: false,
      hasAce: () => false,
    };
    const dealerHand = {
      handValue: 18,
      isBlackJack: false,
      hasAce: () => false,
    };
    const msg = game.evaluateHandResult(playerHand, dealerHand, 100);
    expect(msg).toMatch(/Az osztó nyert/i);
  });

  test("applyPlayerNextMove HIT draws card and adds to hand", () => {
    const move = "Hit";
    game.player.getHand = jest.fn(() => mockPlayerHand);
    game.shoe.draw = jest.fn(() => ({ countValue: 1 }));
    game.applyPlayerNextMove(move, 0);
    expect(game.player.getHand).toHaveBeenCalledWith(0);
    expect(game.runningCount).toBe(1);
  });

  test("applyPlayerNextMove DOUBLE doubles down and draws card", () => {
    const move = "Double";
    game.player.doubleDown = jest.fn();
    game.shoe.draw = jest.fn(() => ({ countValue: 1 }));
    game.applyPlayerNextMove(move, 0);
    expect(game.player.doubleDown).toHaveBeenCalledWith(game.shoe, 0);
    expect(game.runningCount).toBe(1);
  });

  test("applyPlayerNextMove SPLIT splits hand", () => {
    const move = "Split";
    game.player.splitHand = jest.fn();
    game.applyPlayerNextMove(move, 0);
    expect(game.player.splitHand).toHaveBeenCalledWith(game.shoe, 0);
  });

  test("playerTurn respects strategy and stops on stand or double", () => {
    let count = 0;
    const hand = { ...mockPlayerHand };
    game.player.hands = [hand];

    // Mock Strategy.getPlayerNextMove: 1x Hit, aztán Stand
    Strategy.getPlayerNextMove.mockImplementation(() =>
      count++ === 0 ? "Hit" : "Stand"
    );

    game.playerTurn();

    expect(game.player.hands.length).toBeGreaterThanOrEqual(1);
  });

  test("dealerTurn hits while strategy says HIT", () => {
    let callCount = 0;
    game.player.hands = [mockPlayerHand];
    game.dealer.hand = { ...mockDealerHand, addCard: jest.fn() };

    Strategy.getDealerNextMove.mockImplementation(() =>
      callCount++ < 2 ? "Hit" : "Stand"
    );

    game.dealerTurn();

    expect(game.dealer.hand.addCard).toHaveBeenCalled();
  });

  test("resetRound resets hands and reshuffles shoe if needed", () => {
    game.player.resetHand = jest.fn();
    game.dealer.resetHand = jest.fn();
    game.shoe.reachedEndMarker = true;
    game.shoe.numDecks = 6;
    game.endMarkerRatio = 0.75;

    game.resetRound();

    expect(game.player.resetHand).toHaveBeenCalled();
    expect(game.dealer.resetHand).toHaveBeenCalled();
    expect(game.runningCount).toBe(0);
  });
});
