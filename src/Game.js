import { Shoe } from "./Shoe.js";
import { basicStrategy } from "./basicStrategy.js";

export class Game {
  constructor(numDecks, endMarkerRatio, hitOnSoft17 = true) {
    this.endMarkerRatio = endMarkerRatio;
    this.shoe = new Shoe(numDecks, this.endMarkerRatio);
    this.playerHand = [];
    this.dealerHand = [];
    this.countValue = 0;
    this.hitOnSoft17 = hitOnSoft17;
  }

  dealInitialCards() {
    this.playerHand = [this.shoe.draw(), this.shoe.draw()];
    this.dealerHand = [this.shoe.draw(), this.shoe.draw()];

    console.log("👤 Játékos: ", this.playerHand);
    console.log("🃏 Osztó: ", this.dealerHand);
  }

  getDealerNextMove(dealerHand) {
    if (this.calculateHandValue(this.playerHand) > 21) return;

    const handValue = this.calculateHandValue(dealerHand);
    const hasAce = dealerHand.some((card) => card.value === "A");

    if (this.hitOnSoft17 && handValue === 17 && hasAce) return "Hit";

    return handValue < 17 ? "Hit" : "Stand";
  }

  applyDealerNextMove(move) {
    if (move !== "Hit") return;

    this.dealerHand.push(this.shoe.draw());

    move = this.getDealerNextMove(this.dealerHand);
    this.applyDealerNextMove(move);
  }

  getPlayerNextMove(playerHand, dealerUpCard) {
    const handValue = this.calculateHandValue(playerHand);
    const hasAce = playerHand.some((card) => card.value === "A");

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

  applyPlayerNextMove(move, handIndex = null) {
    switch (move) {
      case "Hit":
        this.drawingCard(move, handIndex);
        return;
      case "Stand":
        return;
      case "Double": // Double the stake
        this.drawingCard(move, handIndex);
        return;
      case "Split":
        this.splitHand();
        return;
    }
  }

  splitHand() {
    const firstCard = this.playerHand[0];
    const secondCard = this.playerHand[1];

    this.playerHand = [
      [firstCard, this.shoe.draw()],
      [secondCard, this.shoe.draw()],
    ];
  }

  drawingCard(move, handIndex) {
    if (Array.isArray(this.playerHand[0])) {
      this.playerHand[handIndex].push(this.shoe.draw());

      this.playerHand.forEach((hand) => {
        move = this.getPlayerNextMove(hand, this.dealerHand[0]);
        this.applyPlayerNextMove(move);
      });
    } else {
      this.playerHand.push(this.shoe.draw());

      move = this.getPlayerNextMove(this.playerHand, this.dealerHand[0]);
      this.applyPlayerNextMove(move);
    }
  }

  determineHandType(playerHand, handValue, hasAce) {
    if (hasAce && handValue > 21) return "hard";

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
    if (Array.isArray(hand[0])) {
      return hand.map((singleHand) => this.calculateHandValue(singleHand));
    }

    let sum = 0;
    let aceCount = 0;

    for (const card of hand) {
      let cardValue = this.getCardValue(card.value);
      if (cardValue === 11) aceCount++;
      sum += cardValue;
    }

    while (sum > 21 && aceCount > 0) {
      sum -= 10;
      aceCount--;
    }

    return sum;
  }

  getCardValue(value) {
    if (value === "A") return 11;
    if (["K", "Q", "J", "T"].includes(value)) return 10;
    return +value;
  }

  evaluateWinner(playerHandValue, dealerHandValue) {
    const hands = Array.isArray(playerHandValue)
      ? playerHandValue
      : [playerHandValue];

    const results = hands.map((handValue) => {
      if (handValue > 21) return "Az osztó nyert! (Játékos túllépte a 21-et)";
      if (dealerHandValue > 21)
        return "A játékos nyert! (Osztó túllépte a 21-et)";

      if (handValue > dealerHandValue) return "A játékos nyert!";
      if (handValue < dealerHandValue) return "Az osztó nyert!";

      return "Döntetlen!";
    });

    return results.length === 1 ? results[0] : results;
  }

  reShuffleShoe() {
    if (this.shoe.needsReshuffle()) {
      console.log("🔄 A shoe elérte a vágókártyát. Újrakeverés...");
      this.shoe = new Shoe(this.shoe.numDecks, this.endMarkerRatio);
    }
  }

  resetHands() {
    this.playerHand = [];
    this.dealerHand = [];
  }

  play() {
    this.dealInitialCards();

    const nextMove = this.getPlayerNextMove(
      this.playerHand,
      this.dealerHand[0].value
    );

    if (nextMove === "Split") {
      this.applyPlayerNextMove(nextMove);

      this.playerHand.forEach((hand, i) =>
        this.applyPlayerNextMove(
          this.getPlayerNextMove(hand, this.dealerHand[0].value),
          i
        )
      );
    } else this.applyPlayerNextMove(nextMove);

    console.log(nextMove);

    const dealerNextMove = this.getDealerNextMove(this.dealerHand);
    this.applyDealerNextMove(dealerNextMove);

    const winner = this.evaluateWinner(
      this.calculateHandValue(this.playerHand),
      this.calculateHandValue(this.dealerHand)
    );

    console.log(this.playerHand);
    console.log(this.dealerHand);
    console.log(winner);

    this.resetHands();
    this.reShuffleShoe();

    console.log(this.shoe);
  }
}
