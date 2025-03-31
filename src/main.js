"use strict";
import { Strategy } from "./strategy/Strategy.js";
import { Game } from "./game/Game.js";
import { Hand } from "./components/Hand.js";

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const bankrollEl = document.getElementById("bankroll");
    const runsEl = document.getElementById("runs");
    const decksEl = document.getElementById("decks");
    const cutCardEl = document.getElementById("cut-card");
    const hitOnSoft17El = document.querySelector(".hit");

    const form = document.querySelector(".params-form");

    let input = {
      bankroll: 0,
      runs: 0,
      hitOnSoft17: hitOnSoft17El.value,
      numDecks: 0,
      cutCard: 0, // 1 = 0.33, 2 = 0.5, 3 = 0.66
    };

    let game;

    document.getElementById("init").addEventListener("click", () => {
      init();

      game = createGame(input.numDecks, input.cutCard, hitOnSoft17El);
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      game.play();
    });

    function init() {
      if (!isNaN(+bankrollEl.value) && +bankrollEl.value > 0)
        input.bankroll = +bankrollEl.value;

      if (!isNaN(+runsEl.value) && +runsEl.value > 0)
        input.runs = +runsEl.value;

      input.numDecks = +decksEl.value;

      input.cutCard = +cutCardEl.value;

      if (input.hitOnSoft17 !== "true") input.hitOnSoft17 = false;

      return input;
    }

    function createGame(numDecks, cutCard, hitOnSoft17) {
      if (numDecks !== 1) {
        return new Game(numDecks, cutCard, hitOnSoft17);
      } else {
        return new Game();
      }
    }
  });
})();
