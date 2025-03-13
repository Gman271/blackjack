"use strict";
import deck from "./Deck.js";

(() => {
  const bankrollEl = document.getElementById("bankroll");
  const runsEl = document.getElementById("runs");
  const decksEl = document.getElementById("decks");
  const endMarkerEl = document.getElementById("endmarker");
  const form = document.querySelector(".params-form");

  let input = {
    bankroll: 0,
    runs: 0,
    numOfDecks: 0,
    endMarker: 0, // Endmarker values: 1 = 1/3, 2 = 1/2, 3 = 2/3
  };

  console.log(deck);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (typeof bankrollEl.value === "number" && bankrollEl.value > 0)
      state.bankroll = bankrollEl.value;

    if (typeof runsEl.value === "number" && runsEl.value > 0)
      state.runs = runsEl.value;

    state.numOfDecks = decksEl.value;

    if (numOfDecks === 1) state.endMarker = 0;

    state.endMarker = endMarkerEl.value;
  });
})();
