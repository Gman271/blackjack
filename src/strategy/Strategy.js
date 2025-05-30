import { basicStrategy } from "./basicStrategy.js";

export class Strategy {
  static getDealerNextMove(playerHand, dealerHand, hitOnSoft17 = true) {
    const activeHands = playerHand.filter((hand) => hand.handValue <= 21);

    if (activeHands.length === 0) return;

    if (hitOnSoft17 && dealerHand.handValue === 17 && dealerHand.isSoft)
      return "Hit";

    return dealerHand.handValue < 17 ? "Hit" : "Stand";
  }

  static getPlayerNextMove(playerHand, dealerHand) {
    if (playerHand.isDoubled) return "Stand";

    let nextMove = Strategy.determineMove({
      handValue: String(playerHand.handValue),
      handType: playerHand.handType,
      hasAce: playerHand.hasAce(),
      dealerUpCard: String(dealerHand.upCardValue),
    });

    if (nextMove === "Double" && playerHand.cards.length > 2) nextMove = "Hit";

    return nextMove;
  }

  static determineMove({ handValue, handType, hasAce, dealerUpCard }) {
    if (handValue >= 21) return "Stand";

    if (handType === "pair")
      return Strategy.handlePair(handValue, hasAce, dealerUpCard);

    if (handType === "soft")
      return Strategy.handleSoft(handValue, dealerUpCard);

    return Strategy.handleHard(handValue, dealerUpCard);
  }

  static handlePair(handValue, hasAce, dealerUpCard) {
    if (handValue === 4 || handValue === 6 || handValue === 14)
      return basicStrategy.pair[4]?.[dealerUpCard];

    if ((handValue === 20 && hasAce) || handValue === 16) return "Split";

    if (handValue === 20) return "Stand";

    return basicStrategy.pair[handValue]?.[dealerUpCard];
  }

  static handleSoft(handValue, dealerUpCard) {
    if (handValue > 19) return "Stand";

    return basicStrategy.soft[handValue]?.[dealerUpCard];
  }

  static handleHard(handValue, dealerUpCard) {
    if (handValue < 9) return "Hit";

    if (handValue > 16) return "Stand";

    return basicStrategy.hard[handValue]?.[dealerUpCard];
  }
}
