import { Shoe } from "../components/Shoe.js";
import { Player } from "../actors/Player.js";
import { Dealer } from "../actors/Dealer.js";

import { Strategy } from "../strategy/Strategy.js";
import { BetStrategy } from "../strategy/BetStrategy.js";

import { MOVES } from "../conf.js";

export class Game {
  constructor(numDecks, endMarkerRatio, hitOnSoft17 = true, bankroll = 300000) {
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    this.player = new Player(bankroll);
    this.dealer = new Dealer();
    this.betStr = new BetStrategy();
    this.endMarkerRatio = endMarkerRatio;
    this.hitOnSoft17 = hitOnSoft17;
    this.startingBankroll = bankroll;
    this.runningCount = 0;
  }

  get trueCount() {
    return Math.floor(this.runningCount / this.shoe.remainingDecks);
  }

  get bet() {
    return this.betStr.getBet(this.trueCount, this.startingBankroll);
  }

  dealInitialCards() {
    const playerHand = this.player.getHand();
    const dealerHand = this.dealer.hand;

    [playerHand, playerHand, dealerHand, dealerHand].forEach((target) => {
      const card = this.shoe.draw();
      target.addCard(card);
      this.runningCount += card.countValue;
    });
  }

  playRound() {
    this.player.placeBet(this.bet);
    this.dealInitialCards();

    this.playerTurn();
    this.dealerTurn();
    const result = this.evaluateWinner();

    this.resetRound();

    return result;
  }

  applyPlayerNextMove(move, handIndex = 0) {
    const actions = {
      [MOVES.HIT]: () => {
        const newCard = this.shoe.draw();
        this.player.getHand(handIndex).addCard(newCard);
        this.runningCount += newCard.countValue;
      },
      [MOVES.DOUBLE]: () => {
        const newCard = this.shoe.draw();
        this.player.doubleDown(this.shoe, handIndex);
        this.runningCount += newCard.countValue;
      },
      [MOVES.SPLIT]: () => {
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
          MOVES.STAND &&
        move !== undefined
      ) {
        this.applyPlayerNextMove(move, index);
        hand = this.player.getHand(index);

        if (hand.isDoubled) break;
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
      )) === MOVES.HIT
    ) {
      const newCard = this.shoe.draw();
      this.dealer.hand.addCard(newCard);
      this.runningCount += newCard.countValue;
    }
  }

  evaluateWinner() {
    if (this.player.hands.length !== this.player.bets.length) {
      throw new Error(
        "The number of player hands does not match the number of bets!"
      );
    }

    return this.player.hands
      .map((hand, i) => {
        return this.evaluateHandResult(
          hand,
          this.dealer.hand,
          this.player.bets[i]
        );
      })
      .join("\n");
  }

  evaluateHandResult(hand, dealerHand, bet) {
    const dealerHandValue = dealerHand.handValue;
    const dealerHasBj = dealerHand.isBlackJack;
    const playerHandValue = hand.handValue;
    const playerHasBj = hand.isBlackJack;

    if (playerHasBj && !dealerHasBj) {
      this.player.addWinnings(bet * 2.5);
      return "🂡 Blackjack! A játékos nyert (3:2)!";
    }

    if (playerHasBj && dealerHasBj) {
      this.player.addWinnings(bet);
      return "🤝 Mindkettő blackjack - döntetlen!";
    }

    if (!playerHasBj && dealerHasBj) {
      return "Az osztó blackjack - játékos veszített.";
    }

    if (playerHandValue > 21)
      return "Az osztó nyert! (Játékos túllépte a 21-et)";
    if (dealerHandValue > 21) {
      this.player.addWinnings(bet * 2);
      return "A játékos nyert! (Osztó túllépte a 21-et)";
    }

    if (playerHandValue > dealerHandValue) {
      this.player.addWinnings(bet * 2);
      return "A játékos nyert!";
    }
    if (playerHandValue === dealerHandValue) {
      this.player.addWinnings(bet);
      return "Döntetlen!";
    }

    return "Az osztó nyert!";
  }

  resetRound() {
    this.player.resetHand();
    this.dealer.resetHand();
    if (this.shoe.reachedEndMarker) {
      this.shoe = new Shoe(this.shoe.numDecks, this.endMarkerRatio);
      this.runningCount = 0;
    }
  }
}
