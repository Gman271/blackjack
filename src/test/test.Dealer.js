import { Dealer } from "../actors/Dealer";

const testDealer = () => {
  const dealer = new Dealer();

  // Kezdetben egy kéz legyen
  console.assert(
    dealer.hand instanceof Hand,
    "Hiba: A dealer nem kezd egy kézzel!"
  );

  // Dealer kéz resetelése
  const initialHand = dealer.hand;
  dealer.resetHand();
  console.assert(
    dealer.hand !== initialHand,
    "Hiba: A dealer kéz resetelése nem működik!"
  );
};
