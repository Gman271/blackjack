"use strict";
import { Game } from "./src/game/Game.js";

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const bankrollEl = document.querySelector(".bankroll-ipt");
    const playsEl = document.querySelector(".plays-ipt");
    const decksEl = document.querySelector(".decks-slt");
    const cutCardEl = document.querySelector(".cutcard-slt");

    const hitOnSoft17El = document.querySelector(".hit-ipt");

    const form = document.querySelector(".params-form");

    let input = {
      bankroll: 0,
      plays: 0,
      hitOnSoft17: hitOnSoft17El.value,
      numDecks: 0,
      cutCard: 0, // 1 = 0.33, 2 = 0.5, 3 = 0.66
    };

    let game;

    document.querySelector(".init-btn").addEventListener("click", () => {
      init();

      game = createGame(
        input.numDecks,
        input.cutCard,
        input.hitOnSoft17,
        input.bankroll
      );
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      for (let i = 0; i <= input.plays; i++) {
        game.play();
      }

      console.log(game.player);
    });

    function init() {
      if (!isNaN(+bankrollEl.value) && +bankrollEl.value > 0)
        input.bankroll = +bankrollEl.value;

      if (!isNaN(+playsEl.value) && +playsEl.value > 0)
        input.plays = +playsEl.value;

      input.numDecks = +decksEl.value;

      input.cutCard = +cutCardEl.value;

      if (input.hitOnSoft17 !== "true") input.hitOnSoft17 = false;

      return input;
    }

    function createGame(numDecks, cutCard, hitOnSoft17, bankroll) {
      if (numDecks !== 1) {
        return new Game(numDecks, cutCard, hitOnSoft17, bankroll);
      } else {
        return new Game(1, cutCard, hitOnSoft17, bankroll);
      }
    }
  });
})();
