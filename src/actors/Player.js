import { Hand } from "../components/Hand.js";

export class Player {
  constructor(bankroll) {
    this.hands = [new Hand()];
    this.bankroll = bankroll;
    this.bets = [0];
  }

  getHand(index = 0) {
    return this.hands[index];
  }

  placeBet(betAmount, handIndex = 0) {
    if (betAmount > this.bankroll)
      throw new Error("Player has not enough chips!");

    this.bankroll -= betAmount;
    this.bets[handIndex] = betAmount;
  }

  addWinnings(amount) {
    this.bankroll += amount;
  }

  resetHand() {
    this.hands = [new Hand()];
    this.bets = [0];
  }

  doubleDown(shoe, handIndex = 0) {
    this.hands[handIndex].doubleDown(shoe);
    const bet = this.bets[handIndex];

    if (bet > this.bankroll) throw new Error("Player has not enough chips!");

    this.bankroll -= bet;
    this.bets[handIndex] = bet * 2;

    console.log(this.bankroll);
    console.log("Player has doubled down!");
  }

  splitHand(shoe, handIndex = 0) {
    if (this.getHand(handIndex).handType !== "pair") return;

    if (this.hands.length >= 4) return;

    const bet = this.bets[handIndex];
    if (bet > this.bankroll) {
      throw new Error("Player has not enough chips!");
    }

    const firstCard = this.hands[handIndex].cards[0];
    const secondCard = this.hands[handIndex].cards[1];

    this.hands[handIndex] = new Hand();
    this.hands[handIndex].addCard(firstCard);
    this.hands[handIndex].addCard(shoe.draw());

    const newHand = new Hand();
    newHand.addCard(secondCard);
    newHand.addCard(shoe.draw());

    this.hands.push(newHand);
    this.bankroll -= this.bets[handIndex];
    this.bets.push(this.bets[handIndex]);
    console.log(this.bankroll);
    console.log("Player has splitted!");
  }

  get runningCount() {
    return this.hands.reduce((sum, hand) => sum + hand.runningCount, 0);
  }
}
