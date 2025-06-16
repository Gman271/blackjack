"use strict";
import { Game } from "./game/Game.js";

import Chart from "chart.js/auto";

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const bankrollEl = document.querySelector(".bankroll-ipt");
    const playsEl = document.querySelector(".plays-ipt");
    const decksEl = document.querySelector(".decks-slt");
    const cutCardEl = document.querySelector(".cutcard-slt");

    const hitOnSoft17El = document.querySelector(".hit-ipt");

    const form = document.querySelector(".params-form");

    let chart = null;

    let input = {
      bankroll: 0,
      plays: 0,
      hitOnSoft17: hitOnSoft17El.value,
      numDecks: 0,
      cutCard: 0, // 1 = 0.33, 2 = 0.5, 3 = 0.66
    };

    let outputs = [];

    let totalPlayedHands = 0;

    let game;

    document.querySelector(".init-btn").addEventListener("click", () => {
      init();

      game = createGame(input.numDecks, input.cutCard, input.hitOnSoft17);
    });

    document.querySelector(".chart-btn").addEventListener("click", () => {
      if (chart) {
        chart.destroy(); // előző chart törlése
      }

      const ctx = document.getElementById("profit-chart").getContext("2d");

      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: outputs.map(
            (row, i) => `play #${i + 1}. ${row.playedHands} hands played`
          ),
          datasets: [
            {
              label: "#profit per played hands",
              data: outputs.map((row) => row.profitPerPlayedHands),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const previousBankroll = game.player.bankroll;

      for (let i = 0; i <= input.plays; i++) {
        game.play();
      }

      const actualBankroll = game.player.bankroll;

      totalPlayedHands += input.plays;

      outputs.push({
        profitPerPlayedHands: actualBankroll - previousBankroll,
        playedHands: totalPlayedHands,
      });

      if (chart) {
        chart.data.labels = outputs.map(
          (row, i) => `play #${i + 1}. ${row.playedHands} hands played`
        );
        chart.data.datasets[0].data = outputs.map(
          (row) => row.profitPerPlayedHands
        );
        chart.update();
      }
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
