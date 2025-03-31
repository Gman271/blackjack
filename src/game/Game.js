import { Shoe } from "../components/Shoe.js";
import { Player } from "../actors/Player.js";
import { Dealer } from "../actors/Dealer.js";

import { Strategy } from "../strategy/Strategy.js";

export class Game {
  constructor(numDecks, endMarkerRatio, hitOnSoft17 = true) {
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    this.player = new Player();
    this.dealer = new Dealer();
    this.hitOnSoft17 = hitOnSoft17;
  }

  dealInitialCards() {
    this.player.getHand().addCard(this.shoe.draw());
    this.player.getHand().addCard(this.shoe.draw());
    this.dealer.hand.addCard(this.shoe.draw());
    this.dealer.hand.addCard(this.shoe.draw());

    console.log("👤 Játékos: ", this.player.getHand().cards);
    console.log("🃏 Osztó: ", this.dealer.hand.cards);
  }

  play() {
    this.dealInitialCards();

    this.playerTurn();
    this.dealerTurn();

    const result = this.evaluateWinner();
    console.log(result);

    this.resetGame();
  }

  applyPlayerNextMove(move, handIndex = 0) {
    const actions = {
      Hit: () => this.player.getHand(handIndex).addCard(this.shoe.draw()),
      Double: () => this.player.doubleDown(this.shoe, handIndex),
      Split: () => this.player.splitHand(this.shoe, handIndex),
    };

    actions[move]?.();
  }

  playerTurn() {
    console.log(this.player.getHand().handValue);
    this.player.hands.forEach((hand, index) => {
      let move;
      while (
        (move = Strategy.getPlayerNextMove(hand, this.dealer.hand)) !==
          "Stand" &&
        move !== undefined
      ) {
        console.log(move);
        this.applyPlayerNextMove(move, index);

        if (hand.isDoubled) {
          console.log("Player doubled, they are no more moves!");
          break;
        }
      }
    });
    console.log(this.player.getHand().handValue);
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

  evaluateWinner() {
    const dealerHandValue = this.dealer.hand.handValue;
    console.log(dealerHandValue);
    return this.player.hands
      .map((hand) => {
        const playerHandValue = hand.handValue;

        if (playerHandValue > 21)
          return "Az osztó nyert! (Játékos túllépte a 21-et)";
        if (dealerHandValue > 21)
          return "A játékos nyert! (Osztó túllépte a 21-et)";

        if (playerHandValue > dealerHandValue) return "A játékos nyert!";
        if (playerHandValue < dealerHandValue) return "Az osztó nyert!";

        return "Döntetlen!";
      })
      .join("\n");
  }

  resetGame() {
    this.player.resetHand();
    this.dealer.resetHand();
    if (this.shoe.reachedEndMarker) {
      console.log("🔄 A shoe elérte a vágókártyát. Újrakeverés...");
      this.shoe = new Shoe(this.shoe.numDecks, this.endMarkerRatio);
    }
  }
}
