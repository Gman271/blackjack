"use strict";
import { Game } from "./game/Game.js";

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const dom = {
      bankrollEl: document.querySelector(".bankroll-ipt"),
      playsEl: document.querySelector(".plays-ipt"),
      decksEl: document.querySelector(".decks-slt"),
      cutCardEl: document.querySelector(".cutcard-slt"),
      form: document.querySelector(".params-form"),
      initBtn: document.querySelector(".init-btn"),
      chartBtn: document.querySelector(".chart-btn"),
      chartCanvas: document.getElementById("profit-chart"),
    };

    const state = {
      input: {
        bankroll: 0,
        plays: 0,
        hitOnSoft17: false,
        numDecks: 1,
        cutCard: 0.5,
      },
      outputs: [],
      totalPlayedHands: 0,
      chart: null,
      game: null,
    };

    dom.initBtn.addEventListener("click", () => {
      state.input = collectInput();
      state.game = new Game(
        state.input.numDecks,
        state.input.cutCard,
        state.input.hitOnSoft17,
        state.input.bankroll
      );
    });

    dom.chartBtn.addEventListener("click", () => {
      if (state.chart) state.chart.destroy();

      const ctx = dom.chartCanvas.getContext("2d");
      state.chart = createChart(ctx, state.outputs);
    });

    dom.form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const { game, input } = state;
      const prevBankroll = game.player.bankroll;

      for (let i = 0; i <= input.plays; i++) {
        game.playRound();
      }

      const profit = game.player.bankroll - prevBankroll;
      state.totalPlayedHands += input.plays;

      state.outputs.push({
        profitPerPlayedHands: profit,
        playedHands: state.totalPlayedHands,
      });

      if (state.chart) {
        updateChart(state.chart, state.outputs);
      }
    });

    function collectInput() {
      const bankroll = parseInt(dom.bankrollEl.value, 10);
      const plays = parseInt(dom.playsEl.value, 10);
      const numDecks = parseInt(dom.decksEl.value, 10);
      const cutCard = parseFloat(dom.cutCardEl.value);
      const hitOnSoft17 =
        document.querySelector('input[name="hit"]:checked')?.value === "true";

      return {
        bankroll: !isNaN(bankroll) && bankroll > 0 ? bankroll : 300000,
        plays: !isNaN(plays) && plays > 0 ? plays : 5,
        numDecks: !isNaN(numDecks) ? numDecks : 1,
        cutCard: !isNaN(cutCard) ? cutCard : 0.5,
        hitOnSoft17,
      };
    }

    function createChart(ctx, data) {
      return new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(
            (row, i) => `play #${i + 1} (${row.playedHands} hands)`
          ),
          datasets: [
            {
              label: "#profit per played hands",
              data: data.map((row) => row.profitPerPlayedHands),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }

    function updateChart(chart, data) {
      chart.data.labels = data.map(
        (row, i) => `play #${i + 1} (${row.playedHands} hands)`
      );
      chart.data.datasets[0].data = data.map((row) => row.profitPerPlayedHands);
      chart.update();
    }
  });
})();
