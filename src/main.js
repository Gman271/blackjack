"use strict";

import { Game } from "./Game.js";

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const bankrollEl = document.getElementById("bankroll");
    const runsEl = document.getElementById("runs");
    const decksEl = document.getElementById("decks");
    const cutCardEl = document.getElementById("cut-card");
    const form = document.querySelector(".params-form");

    let input = {
      bankroll: 0,
      runs: 0,
      numDecks: 0,
      cutCard: 0, // 1 = 0.33, 2 = 0.5, 3 = 0.66
    };

    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!isNaN(+bankrollEl.value) && +bankrollEl.value > 0)
        input.bankroll = +bankrollEl.value;

      if (!isNaN(+runsEl.value) && +runsEl.value > 0)
        input.runs = +runsEl.value;

      input.numDecks = +decksEl.value;
      input.cutCard = +cutCardEl.value;

      if (input.numDecks !== 1) {
        const game = new Game(input.numDecks, input.cutCard);
        game.dealInitialCards();
      } else {
        const game = new Game();
        game.dealInitialCards();
      }
    });
  });
})();
