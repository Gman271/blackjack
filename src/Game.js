import { Shoe } from "./Shoe.js";
import { basicStrategy } from "./basicStrategy.js";

export class Game {
  constructor(numDecks, endMarkerRatio) {
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    this.playerHand = [];
    this.dealerHand = [];
  }

  dealInitialCards() {
    this.playerHand.push(this.shoe.draw());
    this.dealerHand.push(this.shoe.draw());
    this.playerHand.push(this.shoe.draw());
    this.dealerHand.push(this.shoe.draw());

    console.log("👤 Játékos: ", this.playerHand);
    console.log("🃏 Osztó: ", this.dealerHand);
  }

  getNextMove(playerHand, dealerUpCard) {
    let handValue = this.calculateHandValue(playerHand);
    let hasAce = playerHand.some((card) => card.value === "A");

    // Handtype
    const handType = this.determineHandType(playerHand, handValue, hasAce);

    console.log(`
      A kéz értéke: ${handValue}
      A kéz típusa: ${handType}   
      `);

    // NextMove
    return this.determineMove(
      playerHand,
      handValue,
      handType,
      hasAce,
      this.getCardValue(dealerUpCard)
    );
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

    console.log(pairValue, dealerUpCard);

    return basicStrategy.pair[pairValue]?.[dealerUpCard];
  }

  handleSoft(handValue, dealerUpCard) {
    if (handValue > 19) return "Stand";

    console.log(handValue, dealerUpCard);

    return basicStrategy.soft[handValue]?.[dealerUpCard];
  }

  handleHard(handValue, dealerUpCard) {
    if (handValue < 9) return "Hit";

    if (handValue > 16) return "Stand";

    console.log(handValue, dealerUpCard);

    return basicStrategy.hard[handValue]?.[dealerUpCard];
  }

  calculateHandValue(hand) {
    return hand.reduce((sum, card) => sum + this.getCardValue(card.value), 0);
  }

  getCardValue(value) {
    if (value === "A") return 11;
    if (["K", "Q", "J", "T"].includes(value)) return 10;
    return +value;
  }
}
