"use strict";

import { Game } from "./Game.js";

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const bankrollEl = document.getElementById("bankroll");
    const runsEl = document.getElementById("runs");
    const decksEl = document.getElementById("decks");
    const cutCardEl = document.getElementById("cut-card");
    /* const hitOnSoft17El = document.querySelector(".hit"); */
    const form = document.querySelector(".params-form");

    const input = init();

    const game = createGame(
      /* input.hitOnSoft17, */ input.numDecks,
      input.cutCard
    );

    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      game.play();
    });

    function init() {
      let input = {
        bankroll: 0,
        runs: 0,
        /* hitOnSoft17: true, */
        numDecks: 0,
        cutCard: 0, // 1 = 0.33, 2 = 0.5, 3 = 0.66
      };

      if (!isNaN(+bankrollEl.value) && +bankrollEl.value > 0)
        input.bankroll = +bankrollEl.value;

      if (!isNaN(+runsEl.value) && +runsEl.value > 0)
        input.runs = +runsEl.value;

      input.numDecks = +decksEl.value;

      input.cutCard = +cutCardEl.value;

      /* if (input.hitOnSoft17 === "true") input.hitOnSoft17 = true;

      input.hitOnSoft17 = false;

      console.log(input.hitOnSoft17); */

      return input;
    }

    function createGame(/* hitOnSoft17, */ numDecks, cutCard) {
      if (numDecks !== 1) {
        return new Game(/* hitOnSoft17, */ numDecks, cutCard);
      } else {
        return new Game(/* hitOnSoft17 */);
      }
    }
  });
})();
