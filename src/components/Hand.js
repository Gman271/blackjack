export class Hand {
  constructor() {
    this.cards = [];
    this.handValue = 0;
    this.handType = "hard";
    this.isDoubled = false;
    this.isSoft = false;
  }

  get upCardValue() {
    return getCardValue(this.cards[0]?.value);
  }

  get runningCount() {
    return this.cards.reduce((sum, card) => sum + card.countValue, 0);
  }

  get isBlackJack() {
    return this.cards.length === 2 && this.handValue === 21;
  }

  addCard(card) {
    if (this.isDoubled && this.cards.length >= 3) return;
    this.cards.push(card);
    this.updateHand();
  }

  doubleDown(shoe) {
    if (this.cards.length === 2) {
      this.isDoubled = true;
      this.addCard(shoe.draw());
    }
  }

  hasAce() {
    return this.cards.some((card) => card.value === "A");
  }

  updateHand() {
    let sum = 0;
    let aceCount = 0;

    for (const card of this.cards) {
      const val = getCardValue(card.value);
      if (val === 11) aceCount++;
      sum += val;
    }

    while (sum > 21 && aceCount > 0) {
      sum -= 10;
      aceCount--;
    }

    this.handValue = sum;
    this.isSoft = this.hasAce() && sum <= 21 && aceCount > 0;

    if (
      this.cards.length === 2 &&
      this.cards[0].value === this.cards[1].value
    ) {
      this.handType = "pair";
    } else if (this.isSoft) {
      this.handType = "soft";
    } else {
      this.handType = "hard";
    }
  }
}

function getCardValue(value) {
  if (value === "A") return 11;
  if (["K", "Q", "J", "T"].includes(value)) return 10;
  return +value;
}
