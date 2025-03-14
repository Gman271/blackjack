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

  getNextMove() {
    const dealerUpCard = this.dealerHand[0].value;
    let handType;
    let handValue = this.playerHand.reduce(
      (sum, card) => sum + this.getCardValue(card.value),
      0
    );
    let hasAce = this.playerHand.some((card) => card.value === "A");

    // Handtype
    if (
      this.playerHand.length === 2 &&
      this.playerHand[0].value === this.playerHand[1].value
    ) {
      handType = "pair";
      handValue = this.playerHand[0];
    } else if (hasAce && handValue <= 21) {
      handType = "soft";
    } else {
      handType = "hard";
    }

    console.log(handType, handValue, hasAce);

    return basicStrategy[handType]?.[handValue]?.[dealerUpCard] || "Hit";
  }

  getCardValue(value) {
    if (value === "A") return 11;
    if (["K", "Q", "J", "T"].includes(value)) return 10;
    return +value;
  }
}
