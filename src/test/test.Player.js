import { Player } from "../actors/Player.js";
import { Hand } from "../components/Hand.js";
import { Shoe } from "../components/Shoe.js";

// 🔵 Player osztály tesztelése
const testPlayer = () => {
  console.log("🔹 Player tesztelés kezdődik...");

  const player = new Player();
  const shoe = new Shoe();

  // 🟢 1. Kezdetben csak 1 kéz legyen
  console.assert(
    player.hands.length === 1,
    "❌ Hiba: Kezdetben nem 1 kéz van!"
  );

  // 🟢 2. Kéz lekérése
  const hand = player.getHand();
  console.assert(
    hand instanceof Hand,
    "❌ Hiba: A getHand nem a megfelelő típust adja vissza!"
  );

  // 🟢 3. Kéz resetelése
  player.resetHand();
  console.assert(
    player.hands.length === 1,
    "❌ Hiba: Reset után nem 1 kéz van!"
  );

  // 🟢 4. Kártya hozzáadása
  player.getHand().addCard({ value: "10" });
  console.assert(
    player.getHand().handValue === 10,
    "❌ Hiba: Nem számolódott helyesen a kéz értéke!"
  );

  // 🟢 5. Duplázás
  player.getHand().addCard({ value: "5" }); // Most 15 az érték
  player.doubleDown(shoe, 0); // Hozzáadunk egy lapot
  console.assert(
    player.getHand().cards.length === 3,
    "❌ Hiba: Duplázás nem működik!"
  );

  // 🟢 6. Osztás (split)
  player.getHand(0).cards = [{ value: "10" }, { value: "10" }];
  player.getHand(0).handType = "pair";
  player.splitHand(shoe, 0);
  console.assert(player.hands.length === 2, "❌ Hiba: Split nem működik!");

  console.log("✅ Player tesztek sikeresen lefutottak!\n");
};
