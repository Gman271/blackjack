import { Strategy } from "./Strategy.js";
import { Player } from "./Player.js";
import { Dealer } from "./Dealer.js";

// Mock Shoe osztály a lapok húzásához
class MockShoe {
  constructor() {
    this.cards = [
      { value: "5" },
      { value: "8" },
      { value: "A" },
      { value: "10" },
      { value: "2" },
    ];
  }
  draw() {
    return this.cards.shift();
  }
}

// 🎮 Mock játékobjektum
class Game {
  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
    this.shoe = new MockShoe();
    this.hitOnSoft17 = true;
  }

  applyPlayerNextMove(move, handIndex = 0) {
    const actions = {
      Hit: () => this.player.getHand(handIndex).addCard(this.shoe.draw()),
      Double: () => this.player.doubleDown(this.shoe, handIndex),
      Split: () => this.player.splitHand(this.shoe, handIndex),
    };

    console.log(`🔹 Apply move: ${move}`);
    actions[move]?.();
  }

  playerTurn() {
    console.log(`🔹 Player turn starts`);
    this.player.hands.forEach((hand, index) => {
      let move;
      while (
        (move = Strategy.getPlayerNextMove(hand, this.dealer.hand)) !== "Stand"
      ) {
        this.applyPlayerNextMove(move, index);
      }
    });
    console.log(`🔹 Player turn ends`);
  }

  dealerTurn() {
    let move;
    while (
      (move = Strategy.getDealerNextMove(
        this.player.hands,
        this.dealer.hand,
        this.hitOnSoft17
      )) === "Hit"
    ) {
      this.dealer.hand.addCard(this.shoe.draw());
    }
  }
}

// 🧪 Segédfüggvény a teszteléshez
function runTest(description, testFunction) {
  console.log(`\n🧪 TEST: ${description}`);
  testFunction();
}

// 🔹 APPLY PLAYER NEXT MOVE TESZTEK
runTest("Player hits and gets a new card", () => {
  const game = new Game();
  game.applyPlayerNextMove("Hit");
  console.log(game.player.getHand().cards); // Egy új kártyának kell lennie a kezében
});

runTest("Player doubles down", () => {
  const game = new Game();
  game.applyPlayerNextMove("Double");
  console.log(game.player.getHand().cards); // Duplázás után egy új kártyának kell lennie
  console.log(game.player.getHand().isDoubled === true); // A duplázásnak be kell kapcsolnia
});

runTest("Player splits hand", () => {
  const game = new Game();
  game.player.getHand().addCard({ value: "8" });
  game.player.getHand().addCard({ value: "8" }); // Párba állítjuk
  game.applyPlayerNextMove("Split");
  console.log(game.player.hands.length === 2); // Két külön kéznek kell lennie
});

// 🔹 PLAYER TURN TESZTEK
runTest("Player plays until Stand", () => {
  const game = new Game();
  game.player.getHand().addCard({ value: "5" });
  game.player.getHand().addCard({ value: "6" });
  game.playerTurn();
  console.log(`Player's final hand value: ${game.player.getHand().handValue}`);
});

// 🔹 DEALER TURN TESZTEK
runTest("Dealer hits until 17 or higher", () => {
  const game = new Game();
  game.dealer.hand.addCard({ value: "3" });
  game.dealer.hand.addCard({ value: "4" });
  game.dealerTurn();
  console.log(`Dealer's final hand value: ${game.dealer.hand.handValue}`);
});
