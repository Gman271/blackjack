import { Hand } from "../components/Hand.js";

export class Dealer {
  constructor() {
    this.hand = new Hand();
  }

  resetHand() {
    this.hand = new Hand();
  }
}
