import { Strategy } from "./Strategy.js";

// Mockolt basicStrategy, hogy ne kelljen importálni az eredetit
const basicStrategy = {
  pair: {
    4: { 2: "Hit", 3: "Split" },
    6: { 2: "Split" },
    14: { 2: "Split" },
    20: { 2: "Stand" },
  },
  soft: {
    18: { 2: "Stand", 3: "Double" },
  },
  hard: {
    8: { 2: "Hit" },
    12: { 2: "Hit", 4: "Stand" },
    17: { 2: "Stand" },
  },
};

// Mockolt Hand osztály, hogy elkerüljük az eredeti osztályok importálását
class MockHand {
  constructor(cards, isSoft = false) {
    this.cards = cards;
    this.isSoft = isSoft;
    this.handValue = cards.reduce(
      (sum, card) => sum + Strategy.#getCardValue(card),
      0
    );
    this.handType = this.determineHandType();
  }

  static #getCardValue(value) {
    return value === "A"
      ? 11
      : ["K", "Q", "J", "T"].includes(value)
      ? 10
      : +value;
  }

  hasAce() {
    return this.cards.includes("A");
  }

  determineHandType() {
    if (this.cards.length === 2 && this.cards[0] === this.cards[1])
      return "pair";
    if (this.isSoft) return "soft";
    return "hard";
  }

  get upCardValue() {
    return this.cards[0];
  }
}

// 🔵 getDealerNextMove tesztelése
const testGetDealerNextMove = () => {
  console.log("🔹 getDealerNextMove tesztelés kezdődik...");

  const playerHand = [new MockHand(["10", "9"])]; // 19-es kéz, valid
  const dealerHand1 = new MockHand(["7", "10"]); // 17, nem soft
  const dealerHand2 = new MockHand(["6", "A"], true); // 17, soft
  const dealerHand3 = new MockHand(["8", "8"]); // 16, hard

  console.assert(
    Strategy.getDealerNextMove(playerHand, dealerHand1) === "Stand",
    "❌ Osztó 17-nél állnia kellene!"
  );
  console.assert(
    Strategy.getDealerNextMove(playerHand, dealerHand2) === "Hit",
    "❌ Osztónak soft 17-nél ütnie kellene!"
  );
  console.assert(
    Strategy.getDealerNextMove(playerHand, dealerHand3) === "Hit",
    "❌ Osztónak 16-nál ütnie kellene!"
  );

  console.log("✅ getDealerNextMove tesztek sikeresen lefutottak!\n");
};

// 🔵 getPlayerNextMove tesztelése
const testGetPlayerNextMove = () => {
  console.log("🔹 getPlayerNextMove tesztelés kezdődik...");

  const playerHand = new MockHand(["A", "7"], true);
  const dealerHand = new MockHand(["5"]);

  const move = Strategy.getPlayerNextMove(playerHand, dealerHand);
  console.assert(
    move === "Double",
    `❌ Hiba: getPlayerNextMove nem adta vissza a várható lépést! (${move})`
  );

  console.log("✅ getPlayerNextMove tesztek sikeresen lefutottak!\n");
};

// 🔵 determineMove tesztelése
const testDetermineMove = () => {
  console.log("🔹 determineMove tesztelés kezdődik...");

  const move1 = Strategy.determineMove({
    handValue: "4",
    handType: "pair",
    hasAce: false,
    dealerUpCard: "2",
  });
  console.assert(
    move1 === "Hit",
    `❌ Hiba: handlePair nem adott vissza Hit-et! (${move1})`
  );

  const move2 = Strategy.determineMove({
    handValue: "18",
    handType: "soft",
    hasAce: true,
    dealerUpCard: "3",
  });
  console.assert(
    move2 === "Double",
    `❌ Hiba: handleSoft nem adott vissza Double-t! (${move2})`
  );

  const move3 = Strategy.determineMove({
    handValue: "12",
    handType: "hard",
    hasAce: false,
    dealerUpCard: "2",
  });
  console.assert(
    move3 === "Hit",
    `❌ Hiba: handleHard nem adott vissza Hit-et! (${move3})`
  );

  console.log("✅ determineMove tesztek sikeresen lefutottak!\n");
};

// 🔵 handlePair tesztelése
const testHandlePair = () => {
  console.log("🔹 handlePair tesztelés kezdődik...");

  const move = Strategy.handlePair("4", false, "3");
  console.assert(
    move === "Split",
    `❌ Hiba: handlePair nem adott vissza Split-et! (${move})`
  );

  console.log("✅ handlePair tesztek sikeresen lefutottak!\n");
};

// 🔵 handleSoft tesztelése
const testHandleSoft = () => {
  console.log("🔹 handleSoft tesztelés kezdődik...");

  const move = Strategy.handleSoft("18", "3");
  console.assert(
    move === "Double",
    `❌ Hiba: handleSoft nem adott vissza Double-t! (${move})`
  );

  console.log("✅ handleSoft tesztek sikeresen lefutottak!\n");
};

// 🔵 handleHard tesztelése
const testHandleHard = () => {
  console.log("🔹 handleHard tesztelés kezdődik...");

  const move = Strategy.handleHard("8", "2");
  console.assert(
    move === "Hit",
    `❌ Hiba: handleHard nem adott vissza Hit-et! (${move})`
  );

  console.log("✅ handleHard tesztek sikeresen lefutottak!\n");
};

// 🔥 Összes teszt futtatása
testGetDealerNextMove();
testGetPlayerNextMove();
testDetermineMove();
testHandlePair();
testHandleSoft();
testHandleHard();

console.log("🎉 Minden Strategy teszt sikeresen lefutott!");
