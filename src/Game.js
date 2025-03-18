import { Shoe } from "./Shoe.js";
import { basicStrategy } from "./basicStrategy.js";

export class Game {
  constructor(numDecks, endMarkerRatio) {
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    this.playerHand = [];
    this.dealerHand = [];
    this.countValue = 0;
  }

  dealInitialCards() {
    this.playerHand = [this.shoe.draw(), this.shoe.draw()];
    this.dealerHand = [this.shoe.draw(), this.shoe.draw()];

    console.log("👤 Játékos: ", this.playerHand);
    console.log("🃏 Osztó: ", this.dealerHand);
  }

  getDealerNextMove(dealerHand) {
    return this.calculateHandValue(dealerHand) < 17 ? "Hit" : "Stand";
  }

  applyDealerNextMove(move) {
    if (move !== "Hit") return;

    this.dealerHand.push(this.shoe.draw());

    move = this.getDealerNextMove(this.dealerHand);
    this.applyDealerNextMove(move);
  }

  getNextMove(playerHand, dealerUpCard) {
    let handValue = this.calculateHandValue(playerHand);
    let hasAce = playerHand.some((card) => card.value === "A");

    // Handtype
    const handType = this.determineHandType(playerHand, handValue, hasAce);

    // NextMove
    return this.determineMove(
      playerHand,
      handValue,
      handType,
      hasAce,
      this.getCardValue(dealerUpCard)
    );
  }

  applyNextMove(move, handIndex = null) {
    switch (move) {
      case "Hit":
        if (Array.isArray(this.playerHand[0])) {
          this.playerHand[handIndex].push(this.shoe.draw());

          this.playerHand.forEach((hand) => {
            move = this.getNextMove(hand, this.dealerHand[0]);
            this.applyNextMove(move);
          });
        } else {
          this.playerHand.push(this.shoe.draw());

          move = this.getNextMove(this.playerHand, this.dealerHand[0]);
          this.applyNextMove(move);
        }

        return;
      case "Stand":
        return;
      case "Double": // Double the stake
        if (Array.isArray(this.playerHand[0])) {
          this.playerHand[handIndex].push(this.shoe.draw());
        } else {
          this.playerHand.push(this.shoe.draw());
        }
        return;
      default:
        const firstCard = this.playerHand[0];
        const secondCard = this.playerHand[1];

        this.playerHand = [
          [firstCard, this.shoe.draw()],
          [secondCard, this.shoe.draw()],
        ];
        return;
    }
  }

  determineHandType(playerHand, handValue, hasAce) {
    if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value)
      return "pair";

    if (hasAce && handValue <= 21) return "soft";

    return "hard";
  }

  determineMove(playerHand, handValue, handType, hasAce, dealerUpCard) {
    if (handType === "pair")
      return this.handlePair(playerHand, hasAce, dealerUpCard);

    if (handType === "soft") return this.handleSoft(handValue, dealerUpCard);

    return this.handleHard(handValue, dealerUpCard);
  }

  handlePair(playerHand, hasAce, dealerUpCard) {
    const pairValue =
      playerHand[0] === "A"
        ? this.getCardValue(playerHand[0].value) * 2 - 1
        : this.getCardValue(playerHand[0].value) * 2;

    if (pairValue === 4 || pairValue === 6 || pairValue === 14)
      return basicStrategy.pair[4]?.[dealerUpCard];

    if ((pairValue === 20 && hasAce) || pairValue === 16) return "Split";

    if (pairValue === 20) return "Stand";

    return basicStrategy.pair[pairValue]?.[dealerUpCard];
  }

  handleSoft(handValue, dealerUpCard) {
    if (handValue > 19) return "Stand";

    return basicStrategy.soft[handValue]?.[dealerUpCard];
  }

  handleHard(handValue, dealerUpCard) {
    if (handValue < 9) return "Hit";

    if (handValue > 16) return "Stand";

    return basicStrategy.hard[handValue]?.[dealerUpCard];
  }

  calculateHandValue(hand) {
    if (Array.isArray(hand[0]))
      hand.map((singleHand) =>
        singleHand.reduce((sum, card) => sum + this.getCardValue(card.value), 0)
      );

    return hand.reduce((sum, card) => sum + this.getCardValue(card.value), 0);
  }

  getCardValue(value) {
    if (value === "A") return 11;
    if (["K", "Q", "J", "T"].includes(value)) return 10;
    return +value;
  }

  evaluateWinner(handValue, dealerHandValue) {
    if (handValue > dealerHandValue && handValue <= 21)
      return "A játékos nyert!";

    if (handValue < dealerHandValue && dealerHandValue <= 21)
      return "Az osztó nyert!";

    return "Döntetlen!";
  }

  resetHands() {
    this.playerHand = [];
    this.dealerHand = [];
  }

  play() {
    this.dealInitialCards();

    const nextMove = this.getNextMove(
      this.playerHand,
      this.dealerHand[0].value
    );

    if (nextMove === "Split") {
      this.applyNextMove(nextMove);

      this.playerHand.forEach((hand, i) =>
        this.applyNextMove(this.getNextMove(hand, this.dealerHand[0].value), i)
      );
    } else this.applyNextMove(nextMove);

    const dealerNextMove = this.getDealerNextMove(this.dealerHand);
    this.applyDealerNextMove(dealerNextMove);

    const winner = this.evaluateWinner(
      this.calculateHandValue(this.playerHand),
      this.calculateHandValue(this.dealerHand)
    );

    console.log(this.playerHand);
    console.log(this.dealerHand);

    this.resetHands();

    console.log(winner);
    console.log(this.shoe);
  }
}
