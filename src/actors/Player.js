import { Hand } from "../components/Hand.js";

export class Player {
  constructor(bankroll) {
    this.hands = [new Hand()];
    this.bankroll = bankroll;
    this.bets = [0];
  }

  get runningCount() {
    return this.hands.reduce((sum, hand) => sum + hand.runningCount, 0);
  }

  getHand(index = 0) {
    return this.hands[index];
  }

  placeBet(amount, index = 0) {
    this.#deductBankroll(amount);
    this.bets[index] = amount;
  }

  addWinnings(amount) {
    this.bankroll += amount;
  }

  resetHand() {
    this.hands = [new Hand()];
    this.bets = [0];
  }

  doubleDown(shoe, index = 0) {
    const hand = this.getHand(index);
    const bet = this.bets[index];

    this.#deductBankroll(bet);
    hand.doubleDown(shoe);
    this.bets[index] = bet * 2;
  }

  splitHand(shoe, index = 0) {
    const hand = this.getHand(index);

    if (hand.handType !== "pair" || this.hands.length >= 4) return;

    const bet = this.bets[index];

    this.#deductBankroll(bet);

    const [card1, card2] = hand.cards;

    const newHand1 = createSplitHand(card1, shoe);
    const newHand2 = createSplitHand(card2, shoe);

    this.hands[index] = newHand1;
    this.hands.push(newHand2);
    this.bets.push(bet);
  }

  #deductBankroll(amount) {
    if (amount > this.bankroll) {
      throw new Error("Player has not enough chips!");
    }
    this.bankroll -= amount;
  }
}

function createSplitHand(card, shoe) {
  const hand = new Hand();
  hand.addCard(card);
  hand.addCard(shoe.draw());
  return hand;
}
