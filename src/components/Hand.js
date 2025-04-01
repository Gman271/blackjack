export class Hand {
  #handValue;
  #handType;

  constructor() {
    this.cards = [];
    this.isDoubled = false;
    this.isSoft = false;
  }

  addCard(card) {
    if (this.isDoubled && this.cards.length >= 3) return;
    this.cards.push(card);
    this.#updateHand();
  }

  get upCardValue() {
    return this.#getCardValue(this.cards[0].value);
  }

  get handValue() {
    return this.#handValue;
  }

  get handType() {
    return this.#handType;
  }

  get runningCount() {
    return this.cards.reduce((sum, card) => sum + card.countValue, 0);
  }

  doubleDown(shoe) {
    if (this.cards.length !== 2) return;

    this.isDoubled = true;
    this.addCard(shoe.draw());
  }

  hasAce() {
    return this.cards.some((card) => card.value === "A");
  }

  #isPair() {
    return (
      this.cards.length === 2 && this.cards[0].value === this.cards[1].value
    );
  }

  #isSoft() {
    let sum = 0;
    let aceCount = 0;

    for (const card of this.cards) {
      let cardValue = this.#getCardValue(card.value);
      if (cardValue === 11) aceCount++;
      sum += cardValue;
    }

    return aceCount > 0 && sum - aceCount * 10 + 10 <= 21;
  }

  #calculateValue() {
    let sum = 0;
    let aceCount = 0;

    for (const card of this.cards) {
      let cardValue = this.#getCardValue(card.value);

      if (cardValue === 11) aceCount++;
      sum += cardValue;
    }

    while (sum > 21 && aceCount > 0) {
      sum -= 10;
      aceCount--;
    }

    return sum;
  }

  #determineHandType() {
    if (this.#isPair()) return "pair";

    if (this.#isSoft()) return "soft";

    return "hard";
  }

  #getCardValue(value) {
    if (value === "A") return 11;
    if (["K", "Q", "J", "T"].includes(value)) return 10;
    return +value;
  }

  #updateHand() {
    this.#handValue = this.#calculateValue();
    this.isSoft = this.#isSoft();
    this.#handType = this.#determineHandType();
  }
}
