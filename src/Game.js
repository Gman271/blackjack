import { Shoe } from "./Shoe.js";

export class Game {
  constructor(numDecks = 1, endMarkerRatio = 1) {
    this.shoe = new Shoe(numDecks, endMarkerRatio);
    this.playerHand = [];
    this.dealerHand = [];
  }

  dealInitialCards() {
    console.log(this.shoe);

    this.playerHand.push(this.shoe.draw());
    this.dealerHand.push(this.shoe.draw());
    this.playerHand.push(this.shoe.draw());
    this.dealerHand.push(this.shoe.draw());

    console.log(this.shoe);

    console.log("👤 Játékos: ", this.playerHand);
    console.log("🃏 Osztó: ", this.dealerHand);
  }
}
