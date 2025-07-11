import { Shoe } from "../components/Shoe.js";
import { Player } from "../actors/Player.js";
import { Dealer } from "../actors/Dealer.js";

import { Strategy } from "../strategy/Strategy.js";
import { BetStrategy } from "../strategy/BetStrategy.js";

import { MOVES } from "../conf.js";

/**
 * Represents a Blackjack game session.
 * Manages the shoe (deck), player, dealer, betting strategy, and game rounds.
 */
export class Game {
  /**
   * Creates a new Game instance.
   *
   * @param {number} numDecks - Number of decks in the shoe.
   * @param {number} endMarkerRatio - Ratio determining when the shoe should be reshuffled.
   * @param {boolean} hitOnSoft17 - Whether the dealer hits on soft 17.
   * @param {number} [bankroll=300000] - Initial money available to the player.
   */
  constructor(numDecks, endMarkerRatio, hitOnSoft17, bankroll = 300000) {
    /**
     * @property {Shoe} shoe - The shoe containing the cards to draw from.
     */
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    /**
     * @property {Player} player - The player participating in the game.
     */
    this.player = new Player(bankroll);
    /**
     * @property {Dealer} dealer - The dealer in the game.
     */
    this.dealer = new Dealer();
    /**
     * @property {BetStrategy} betStr - The betting strategy used to determine bet sizes.
     */
    this.betStr = new BetStrategy();
    /**
     * @property {number} endMarkerRatio - Threshold ratio for reshuffling the shoe.
     */
    this.endMarkerRatio = endMarkerRatio;
    /**
     * @property {boolean} hitOnSoft17 - Flag indicating if dealer hits on soft 17.
     */
    this.hitOnSoft17 = hitOnSoft17;
    /**
     * @property {number} startingBankroll - The initial bankroll of the player.
     */
    this.startingBankroll = bankroll;
    /**
     * @property {number} runningCount - The current running count used for card counting.
     */
    this.runningCount = 0;
  }

  /**
   * Calculates the true count based on the running count and remaining decks.
   * @returns {number} The true count used for betting and strategy.
   */
  get trueCount() {
    return Math.floor(this.runningCount / this.shoe.remainingDecks);
  }

  /**
   * Gets the current bet size based on the true count and starting bankroll.
   * @returns {number} The bet amount to place.
   */
  get bet() {
    return this.betStr.getBet(this.trueCount, this.startingBankroll);
  }

  /**
   * Deals initial cards to the player and dealer.
   * Adds the cards to hands and updates running count accordingly.
   */
  dealInitialCards() {
    const playerHand = this.player.getHand();
    const dealerHand = this.dealer.hand;

    [playerHand, playerHand, dealerHand, dealerHand].forEach((target) => {
      const card = this.shoe.draw();
      target.addCard(card);
      this.runningCount += card.countValue;
    });
  }

  /**
   * Plays a full round of blackjack: places bet, deals cards, player and dealer turns, evaluates result.
   * @returns {string} The result of the round.
   */
  playRound() {
    this.player.placeBet(this.bet);
    this.dealInitialCards();

    this.playerTurn();
    this.dealerTurn();
    const result = this.evaluateWinner();

    this.resetRound();

    return result;
  }

  /**
   * Applies the player's next move (hit, double, split) on a specific hand.
   * @param {string} move - The move to apply (from MOVES).
   * @param {number} [handIndex=0] - Index of the player's hand to apply the move on.
   */
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

  /**
   * Executes the player's turn by repeatedly applying moves until the player stands or busts.
   */
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

  /**
   * Executes the dealer's turn according to game rules and strategy.
   */
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

  /**
   * Evaluates the outcome of player's hands against the dealer's hand.
   * @throws {Error} If the number of hands does not match the number of bets.
   * @returns {string} Combined results of all hands.
   */
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

  /**
   * Evaluates the result of a single hand compared to the dealer's hand.
   * Pays out winnings accordingly.
   *
   * @param {Hand} hand - The player's hand.
   * @param {Hand} dealerHand - The dealer's hand.
   * @param {number} bet - The bet amount on this hand.
   * @returns {string} A descriptive result of the hand outcome.
   */
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

  /**
   * Resets hands and checks if shoe needs reshuffling.
   * Resets running count if shoe is reshuffled.
   */
  resetRound() {
    this.player.resetHand();
    this.dealer.resetHand();
    if (this.shoe.reachedEndMarker) {
      this.shoe = new Shoe(this.shoe.numDecks, this.endMarkerRatio);
      this.runningCount = 0;
    }
  }
}
