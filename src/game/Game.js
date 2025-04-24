import { Shoe } from "../components/Shoe.js";
import { Player } from "../actors/Player.js";
import { Dealer } from "../actors/Dealer.js";

import { Strategy } from "../strategy/Strategy.js";
import { BetStrategy } from "../strategy/BetStrategy.js";

export class Game {
  constructor(numDecks, endMarkerRatio, hitOnSoft17 = true, bankroll = 300000) {
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    this.player = new Player(bankroll);
    this.dealer = new Dealer();
    this.betStr = new BetStrategy();
    this.hitOnSoft17 = hitOnSoft17;
    this.initBankroll = bankroll;
    this.runningCount = 0;
  }

  dealInitialCards() {
    const playerHand = this.player.getHand();
    const dealerHand = this.dealer.hand;

    [playerHand, playerHand, dealerHand, dealerHand].forEach((target) => {
      const card = this.shoe.draw();
      target.addCard(card);
      this.runningCount += card.countValue;
    });

    console.log("👤 Játékos: ", this.player.getHand().cards);
    console.log("🃏 Osztó: ", this.dealer.hand.cards);
  }

  play() {
    console.log(this.player.bankroll);
    this.player.placeBet(this.bet);

    console.log(this.bet);
    console.log(this.player.bankroll);

    this.dealInitialCards();

    this.playerTurn();

    this.dealerTurn();

    const result = this.evaluateWinner();
    console.log(result);

    this.resetGame();
  }

  applyPlayerNextMove(move, handIndex = 0) {
    const actions = {
      Hit: () => {
        const newCard = this.shoe.draw();
        this.player.getHand(handIndex).addCard(newCard);
        this.runningCount += newCard.countValue;
      },
      Double: () => {
        const newCard = this.shoe.draw();
        this.player.doubleDown(this.shoe, handIndex);
        this.runningCount += newCard.countValue;
      },
      Split: () => {
        this.player.splitHand(this.shoe, handIndex);
      },
    };

    actions[move]?.();
  }

  playerTurn() {
    this.player.hands.forEach((hand, index) => {
      let move;
      while (
        (move = Strategy.getPlayerNextMove(hand, this.dealer.hand)) !==
          "Stand" &&
        move !== undefined
      ) {
        this.applyPlayerNextMove(move, index);

        hand = this.player.getHand(index);

        if (hand.isDoubled) {
          move = "Stand";
          break;
        }
      }
    });
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
      const newCard = this.shoe.draw();
      this.dealer.hand.addCard(newCard);
      this.runningCount += newCard.countValue;
    }
  }

  evaluateWinner() {
    const dealerHandValue = this.dealer.hand.handValue;
    const dealerHasBj = this.dealer.hand.isBlackJack;

    return this.player.hands
      .map((hand, i) => {
        const playerHandValue = hand.handValue;
        const playerHasBj = hand.isBlackJack;

        if (playerHasBj && !dealerHasBj) {
          this.player.addWinnings(this.player.bets[i] * 2.5);
          return "🂡 Blackjack! A játékos nyert (3:2)!";
        }

        if (playerHasBj && dealerHasBj) {
          this.player.addWinnings(this.player.bets[i]);
          return "🤝 Mindkettő blackjack - döntetlen!";
        }

        if (!playerHasBj && dealerHasBj) {
          return "Az osztó blackjack - játékos veszített.";
        }

        if (playerHandValue > 21)
          return "Az osztó nyert! (Játékos túllépte a 21-et)";
        if (dealerHandValue > 21) {
          this.player.addWinnings(this.player.bets[i] * 2);
          return "A játékos nyert! (Osztó túllépte a 21-et)";
        }

        if (playerHandValue > dealerHandValue) {
          this.player.addWinnings(this.player.bets[i] * 2);
          return "A játékos nyert!";
        }
        if (playerHandValue === dealerHandValue) {
          this.player.addWinnings(this.player.bets[i]);
          return "Döntetlen!";
        }

        return "Az osztó nyert!";
      })
      .join("\n");
  }

  resetGame() {
    this.player.resetHand();
    this.dealer.resetHand();
    if (this.shoe.reachedEndMarker) {
      console.log("🔄 A shoe elérte a vágókártyát. Újrakeverés...");
      this.shoe = new Shoe(this.shoe.numDecks, this.endMarkerRatio);
      this.runningCount = 0;
    }
  }

  get trueCount() {
    return Math.floor(this.runningCount / this.shoe.remainingDecks);
  }

  get bet() {
    return this.betStr.getBet(this.trueCount, this.initBankroll);
  }
}
