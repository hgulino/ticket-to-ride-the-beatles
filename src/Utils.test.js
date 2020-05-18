import { GenerateDeck, CanComplete, Discard } from "./Utils";
import Cities from "./map.json";
import DestinationTickets from "./destination_tickets.json";
import CONNECTIONS from "./connections.json";

let suits = [
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
  "BLACK",
  "WHITE",
];
let player = {
  id: 0,
  color: "green",
  hand: [
    "BLACK",
    "BLACK",
    "BLACK",
    "BLUE",
    "BLUE",
    "BLUE",
    "GREEN",
    "GREEN",
    "GREEN",
    "GREEN",
    "ORANGE",
    "ORANGE",
    "ORANGE",
    "PINK",
    "PINK",
    "WILD",
    "WILD",
    "YELLOW",
  ],
  trains: 17,
  destinationTickets: [],
};
let num_suits = 12;
let num_wilds = 14;
let expected = [];

it("Generates the deck", () => {
  const deck = GenerateDeck(suits, num_suits, num_wilds);
  expected = Array(num_suits).fill("RED");
  expect(deck).toEqual(expect.arrayContaining(expected));
});

describe("Checks if route can be completed", () => {
  it("checks if route can be completed", () => {
    expect(CanComplete(CONNECTIONS[0], player.hand)).toEqual(true);
  });

  it("should fail if not enough cards", () => {
    player = {
      id: 0,
      color: "green",
      hand: ["BLACK", "BLACK"],
      trains: 17,
      destinationTickets: [],
    };
    expect(CanComplete(CONNECTIONS[0], player.hand)).toEqual(false);
  });

  it("should succeed if enough wild cards", () => {
    player = {
      id: 0,
      color: "green",
      hand: ["WILD", "WILD", "WILD"],
      trains: 17,
      destinationTickets: [],
    };
    expect(CanComplete(CONNECTIONS[0], player.hand)).toEqual(true);
  });

  it("should succeed if enough colored cards and wild cards combined", () => {
    player = {
      id: 0,
      color: "green",
      hand: ["BLUE", "BLUE", "WILD", "WILD"],
      trains: 17,
      destinationTickets: [],
    };
    expect(CanComplete(CONNECTIONS[0], player.hand)).toEqual(true);
  });

  it("should succeed if enough of any card", () => {
    player = {
      id: 0,
      color: "green",
      hand: ["BLUE", "BLUE", "WILD", "WILD"],
      trains: 17,
      destinationTickets: [],
    };
    expect(CanComplete(CONNECTIONS[2], player.hand)).toEqual(true);
  });
});

describe("Cards are sent to discard pile", () => {
  let G = {
    players: [
      {
        id: 0,
        color: null,
        hand: ["BLUE", "BLUE", "WILD", "YELLOW"],
        selectedCards: [0, 1, 2],
        trains: 17,
        destinationTickets: [],
      },
    ],
    discard_pile: [],
  };

  let ctx = {
    numPlayers: 2,
    turn: 1,
    currentPlayer: "0",
    playOrder: ["0", "1"],
    playOrderPos: 0,
    phase: "drawCards",
    activePlayers: null,
    numMoves: 0,
  };

  it("should discard cards", () => {
    expect(Discard(G, ctx, CONNECTIONS[0])).toEqual(true);

    expect(G.discard_pile.sort()).toEqual(["BLUE", "BLUE", "WILD"]);
  });
});
