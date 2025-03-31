import { Hand } from "../components/Hand.js";

export class Player {
  constructor() {
    this.hands = [new Hand()];
  }

  getHand(index = 0) {
    return this.hands[index];
  }

  resetHand() {
    this.hands = [new Hand()];
  }

  doubleDown(shoe, handIndex = 0) {
    this.hands[handIndex].doubleDown(shoe);
  }

  splitHand(shoe, handIndex = 0) {
    console.log(this.hands);
    if (this.getHand(handIndex).handType !== "pair") return;

    if (this.hands.length >= 4) return;

    const firstCard = this.hands[handIndex].cards[0];
    const secondCard = this.hands[handIndex].cards[1];

    this.hands[handIndex] = new Hand();
    this.hands[handIndex].addCard(firstCard);
    this.hands[handIndex].addCard(shoe.draw());

    const newHand = new Hand();
    newHand.addCard(secondCard);
    newHand.addCard(shoe.draw());

    this.hands.push(newHand);
  }
}
