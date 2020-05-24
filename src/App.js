import React from "react";
import { GenerateDeck } from "./Utils";

import { Client } from "boardgame.io/react";

import Cities from "./map.json";
import DestinationTickets from "./destination_tickets.json";
import connections from "./connections.json";

const SUITS = ["ORANGE", "YELLOW", "PINK", "GREEN", "BLUE", "BLACK"];
const NUM_SUITS = 6;
const NUM_WILDS = 8;

// Return true if `cells` is in a winning configuration.
// function IsVictory(cells) {}

// // Return true if all `cells` are occupied.
// function IsDraw(cells) {
//   return cells.filter((c) => c === null).length === 0;
// }

function DrawCard(G, ctx) {
  G.players[ctx.currentPlayer].hand.push(G.deck[0]);
  G.players[ctx.currentPlayer].hand.sort();
  G.deck.shift();
}

function DealToFiveUp(G) {
  G.five_up.push(G.deck[0]);
  G.deck.shift();

  let wild_cards = 0;
  G.five_up.forEach(function (card) {
    if (card === "WILD") wild_cards++;
  });

  if (wild_cards > 3) {
    G.discard_pile.push(G.five_up);
    G.five_up = [];
  }

  if (G.five_up.length < 5) {
    DealToFiveUp(G);
  }
}

function DealCards(G, currentPlayer) {
  G.players[currentPlayer].hand.push(G.deck[0]);
  G.players[currentPlayer].hand.sort();
  G.deck.shift();
}

function DealDestinationCards(G, currentPlayer) {
  G.players[currentPlayer].destinationTickets.push(G.destination_tickets[0]);
  G.players[currentPlayer].destinationTickets.sort();
  G.destination_tickets.shift();
}

function DiscardDestinationCards(G, ctx, index) {
  G.destination_tickets.push(
    G.players[ctx.currentPlayer].destinationTickets[index]
  );
  delete G.players[ctx.currentPlayer].destinationTickets[index];
  G.players[ctx.currentPlayer].destinationTickets.shift();
}

function ChooseColor(G, ctx, index) {
  G.players[ctx.currentPlayer]["color"] = G.available_colors[index];
  delete G.available_colors[index];
  G.available_colors.shift();
}

function ShuffleDeck(G, ctx) {
  G.deck = ctx.random.Shuffle(G.deck);
}

function DrawRandomCard(G, ctx, id) {}

function PlayCard(G, ctx, id) {}

function GeneratePlayerData(ctx) {
  var playersMetaData = [];
  for (let i = 0; i < ctx.numPlayers; i++) {
    let player = {
      id: i,
      points: 0,
      color: null,
      hand: [],
      selectedCards: [],
      trains: 17,
      destinationTickets: [],
    };
    playersMetaData.push(player);
  }
  return playersMetaData;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const TicketToRide = {
  setup: (ctx) => ({
    players: GeneratePlayerData(ctx),
    available_colors: [
      { name: "Pink", hex: "#EC407A" },
      { name: "Red", hex: "#EF5350" },
      { name: "Deep Purple", hex: "#7E57C2" },
      { name: "Indigo", hex: "#5C6BC0" },
      { name: "Blue", hex: "#42A5F5" },
      { name: "Deep Orange", hex: "#FF7043" },
      { name: "Green", hex: "#66BB6A" },
    ],
    five_up: [],
    deck: shuffle(GenerateDeck(SUITS, NUM_SUITS, NUM_WILDS)),
    destination_tickets: shuffle(DestinationTickets),
    board: connections,
    discard_pile: [],
  }),

  turn: { moveLimit: 1 },

  phases: {
    chooseColor: {
      start: true,
      moves: { ChooseColor },
      next: "DealCards",
      endIf: (G, ctx) => {
        for (let i = 0; i < G.players.length; i++) {
          if (G.players[i]["color"] === null) return false;
        }

        return true;
      },
    },
    // drawCards: {
    //   moves: { DrawCard, DrawRandomCard },
    //   start: true,
    // },

    // drawTickets: {
    //   moves: { DrawCard, DrawRandomCard },
    // },

    // connect: {
    //   moves: { PlayCard },
    // },
    DealCards: {
      onBegin: (G, ctx) => {
        for (let i = 0; i < ctx.numPlayers; i++) {
          for (let j = 0; j < 2; j++) {
            DealCards(G, i);
            DealDestinationCards(G, i);
          }
        }
        DealToFiveUp(G);
      },
      moves: { DiscardDestinationCards },
    },
  },

  endIf: (G, ctx) => {
    // if (IsVictory(G.cells)) {
    //   return { winner: ctx.currentPlayer };
    // }
    // if (IsDraw(G.cells)) {
    //   return { draw: true };
    // }
  },
};

function CardComponent(props) {
  return (
    <div style={{ width: "50px", border: "1px solid red" }}>{props.name}</div>
  );
}

class TicketToRideBoard extends React.Component {
  onClick() {}

  isActive(id) {
    if (!this.props.isActive) return false;
    return true;
  }

  render() {
    let winner = "";
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id='winner'>Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
          <div id='winner'>Draw!</div>
        );
    }

    let player = this.props.G.players[this.props.playerID];

    let cards = player.hand;

    cards =
      this.props.G.players[this.props.playerID].hand.length === 0 ? (
        <div>No cards!</div>
      ) : (
        <div>
          {cards.map((x, i = 0) => (
            <div key={i} style={{ backgroundColor: x }}>
              {x}
            </div>
          ))}
        </div>
      );

    let board = this.props.G.board;

    const cellStyle = {};

    return (
      <div>
        <h1>{"Ticket to Ride: The Beatles"}</h1>
        <div id='map' />
        <ul>
          {/* {board.map((x, i = 0) => (
            <li key={i} style={{ backgroundColor: x.occupied ? "red" : null }}>
              <ul>
                <li>{"Route: " + ++i}</li>
                <li>{"Start: " + x.start}</li>
                <li>{"End: " + x.end}</li>
                <li>{"Color: " + x.color}</li>
                <li>{"Length: " + x.length}</li>
                <li />
              </ul>
            </li>
          ))} */}
        </ul>
        <div>{cards}</div>
        {winner}
      </div>
    );
  }
}

const App = Client({
  game: TicketToRide,
  board: TicketToRideBoard,
});

export default App;
