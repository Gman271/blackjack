import { Hand } from "../components/Hand.js";

export class Dealer {
  constructor() {
    this.hand = new Hand();
  }

  resetHand() {
    this.hand = new Hand();
  }
}

function testDealer() {
  console.log("🔍 Dealer osztály tesztelése...");

  let dealer = new Dealer();

  // 📌 Teszt: Kezdéskor üres a kéz
  console.assert(
    dealer.hand.cards.length === 0,
    "❌ Hiba: A dealer kezdéskor üres kézzel kell induljon!"
  );

  // 📌 Teszt: Lap hozzáadása
  dealer.hand.addCard({ value: "K" });
  console.assert(
    dealer.hand.calculateValue() === 10,
    "❌ Hiba: A K értékének 10-nek kell lennie!"
  );

  // 📌 Teszt: Osztó lapjának felfedése
  dealer.hand.addCard({ value: "7" });
  console.assert(
    dealer.getUpCardValue() === 10,
    "❌ Hiba: Az első lap értékének 10-nek kell lennie!"
  );

  // 📌 Teszt: Osztó húz-e további lapot (ha 16 alatt van)
  console.assert(
    dealer.shouldHit(false) === false,
    "❌ Hiba: A dealernek nem kéne húznia!"
  );

  // 📌 Teszt: Osztó húz-e soft 17-nél
  dealer = new Dealer();
  dealer.hand.addCard({ value: "A" });
  dealer.hand.addCard({ value: "6" });

  console.assert(
    dealer.shouldHit(true) === true,
    "❌ Hiba: Soft 17 esetén hitOnSoft17=true-nál húznia kell!"
  );

  console.log("✅ Minden Dealer teszt sikeres!");
}
