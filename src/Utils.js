/**
 *
 * @param {int} suits the number of colors in deck
 * @param {int} num_suits the number of cards for each suit
 * @param {int} num_wilds the number of wild cards to append
 */
export function GenerateDeck(suits, num_suits, num_wilds) {
  let deck = new Array(suits.length * num_suits + num_wilds); // create empty array for deck
  let i = 0;
  // add each card suit and its corresponding number of cards
  suits.forEach((suit) => {
    deck.fill(suit, i, i + num_suits);
    i += num_suits;
  });
  // fill the rest with wild cards
  if (num_wilds) deck.fill("WILD", i, i + num_wilds);
  // return deck, don't worry about order
  return deck;
}

/**
 *
 * @param {JSON} route the route to be completed. Should contain COLOR and LENGTH in JSON data
 * @param {ARRAY} player_hand the array of cards in the player's hand
 */

export function CanComplete(route, player_hand) {
  const suit = route.color;
  const length = route.length;
  let hand = {};

  // if no cards, return false
  if (player_hand.length === 0) {
    return false;
  }

  // create temporary object to count number of each card of each suit
  player_hand.forEach(function (x) {
    hand[x] = (hand[x] || 0) + 1;
  });

  // if route color is "WILD" use any COLOR combination
  if (suit === "WILD") {
    // Loop through available colors and add wild card value to compare
    for (const c in hand) {
      if (hand[c] + hand["WILD"] >= length) return true;
    }
  }

  // if a specific color, check if there are enough COLOR cards, or enough with WILD
  if (
    hand[suit] >= length || hand[suit] !== undefined
      ? hand[suit] + hand["WILD"] >= length
      : hand["WILD"] >= length
  ) {
    return true;
  }

  return false;
}

export function Discard(G, ctx, route) {
  let hand = G.players[ctx.currentPlayer].hand;
  let cardsToRemove = [];
  let selected = G.players[ctx.currentPlayer].selectedCards;

  selected.forEach(function (x) {
    cardsToRemove.push(hand[x]);
  });

  if (CanComplete(route, cardsToRemove)) {
    for (let i = selected.length - 1; i >= 0; i--) {
      G.discard_pile.push(G.players[ctx.currentPlayer].hand[i]);
      G.players[ctx.currentPlayer].hand.splice(selected[i], 1);
    }
    return true;
  }

  return false;
}
