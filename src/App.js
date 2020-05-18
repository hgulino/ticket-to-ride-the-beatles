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
    five_up: [],
    deck: shuffle(GenerateDeck(SUITS, NUM_SUITS, NUM_WILDS)),
    destination_tickets: shuffle(DestinationTickets),
    board: connections,
    discard_pile: [],
  }),

  turn: { moveLimit: 1 },

  phases: {
    drawCards: {
      moves: { DrawCard, DrawRandomCard },
      start: true,
    },

    drawTickets: {
      moves: { DrawCard, DrawRandomCard },
    },

    connect: {
      moves: { PlayCard },
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

    let board = this.props.G.board;

    const cellStyle = {};

    return (
      <div>
        <h1>{"Ticket to Ride: The Beatles"}</h1>
        <div id='map' />
        <ul>
          {board.map((x, i = 0) => (
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
          ))}
        </ul>
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
