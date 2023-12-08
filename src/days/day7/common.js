import { nbArrToStr, strToNbArr } from '../../utils/input.utils.js';

// prettier-ignore
const handsTypes = /** @type {const} */ ([
  'high-card',
  'one-pair',
  'two-pairs',
  'three-of-a-kind',
  'full-house',
  'four-of-a-kind',
  'five-of-a-kind',
]);

// prettier-ignore
const cardsValues = /** @typedef {const} */({
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
});

// prettier-ignore
const cardsValuesWithJoker = /** @typedef {const} */({
  'J': 1,
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'T': 10,  'Q': 11, 'K': 12, 'A': 13,
});

/**
 * @typedef {{
 *   cards: [number, number, number, number, number];
 *   bid: number;
 *   type: number;
 * }} Hand
 */
/**
 * @typedef {Hand & { rank: number }} RankedHand
 */

/**
 *
 * @param {string[]} lines
 * @returns {Hand[]}
 */
export function parseInput(lines) {
  const hands = [];

  for (const line of lines) {
    const [handStr, bidStr] = line.split(' ');

    const cards = /** @type {Hand['cards']} */ (
      handStr
        .split('')
        .map((c) => cardsValues[/** @type {keyof typeof cardsValues} */ (c)])
    );
    const handType = computeHandType(cards);

    const hand = {
      cards,
      bid: Number(bidStr),
      type: handType,
    };

    hands.push(hand);
  }

  return hands;
}

/**
 *
 * @param {string[]} lines
 * @returns {Hand[]}
 */
export function parseInput2(lines) {
  const hands = [];

  for (const line of lines) {
    const [handStr, bidStr] = line.split(' ');

    const cards = /** @type {Hand['cards']} */ (
      handStr
        .split('')
        .map(
          (c) =>
            cardsValuesWithJoker[
              /** @type {keyof typeof cardsValuesWithJoker} */ (c)
            ]
        )
    );
    const handType = computeHandTypeWithJoker(cards);

    const hand = {
      cards,
      bid: Number(bidStr),
      type: handType,
    };

    hands.push(hand);
  }

  return hands;
}

/**
 *
 * @param {Hand['cards']} cards
 * @returns {Hand['type']}
 */
function computeHandType(cards) {
  const cardsFreqs = new Map();

  for (const card of cards) {
    cardsFreqs.set(card, (cardsFreqs.get(card) ?? 0) + 1);
  }

  /** @type {typeof handsTypes[number]} */
  let handType = 'five-of-a-kind';

  switch (true) {
    case cardsFreqs.size === 1: {
      handType = 'five-of-a-kind';
      break;
    }

    case cardsFreqs.size === 5: {
      handType = 'high-card';
      break;
    }

    case cardsFreqs.size === 4: {
      handType = 'one-pair';
      break;
    }

    case cardsFreqs.size === 3: {
      handType = 'two-pairs';
      for (const [card, freq] of cardsFreqs) {
        if (freq === 3) {
          handType = 'three-of-a-kind';
        }
      }
      break;
    }

    case cardsFreqs.size === 2: {
      handType = 'full-house';
      for (const [card, freq] of cardsFreqs) {
        if (freq === 4) {
          handType = 'four-of-a-kind';
        }
      }
      break;
    }

    default:
      throw 'error';
  }

  return handsTypes.findIndex((elt) => elt === handType);
}

/**
 *
 * @param {Hand['cards']} cards
 * @returns {Hand['type']}
 */
function computeHandTypeWithJoker(cards) {
  const cardsFreqs = new Map();

  for (const card of cards) {
    cardsFreqs.set(card, (cardsFreqs.get(card) ?? 0) + 1);
  }

  // compute hand type without joker then upgrade it based on joker cards counts
  const jokerCounts = cardsFreqs.get(cardsValuesWithJoker.J) ?? 0;
  cardsFreqs.delete(cardsValuesWithJoker.J);

  /** @type {typeof handsTypes[number]} */
  let handType = 'five-of-a-kind';

  switch (true) {
    case cardsFreqs.size <= 1: {
      // five of a kind, or 5 jokers
      handType = 'five-of-a-kind';
      break;
    }

    case cardsFreqs.size === 5: {
      // no joker because we removed them, no upgrade possible
      handType = 'high-card';
      break;
    }

    case cardsFreqs.size === 4: {
      // if joker = 1, then high-card upgraded to one-pair
      // if joker = 0, then one-pair
      handType = 'one-pair';
      break;
    }

    case cardsFreqs.size === 3: {
      if (jokerCounts === 2) {
        // 3 different cards, one is upgraded by 2 jokers
        handType = 'three-of-a-kind';
        break;
      }
      if (jokerCounts === 1) {
        // 2 different cards, 1 card has 2 occurences, one-pair upgraded to three-of-a-kind by 1 joker
        handType = 'three-of-a-kind';
        break;
      }
      // no joker
      handType = 'two-pairs';
      for (const [card, freq] of cardsFreqs) {
        if (freq === 3) {
          handType = 'three-of-a-kind';
        }
      }
      break;
    }

    case cardsFreqs.size === 2: {
      if (jokerCounts === 3) {
        // 2 different cards, upgraded to four-of-a-kind by 3 jokers
        handType = 'four-of-a-kind';
        break;
      }
      if (jokerCounts === 2) {
        // one-pair + 1 single card, upgraded to four-of-a-kind by 2 jokers
        handType = 'four-of-a-kind';
        break;
      }
      if (jokerCounts === 1) {
        // either 2 pairs or three-of-a-kind + 1 single
        // upgrade to full house  or   four-of-a-kind
        for (const [card, freq] of cardsFreqs) {
          if (freq === 2) {
            // 2 pairs upgraded to full house
            handType = 'full-house';
          } else {
            // 1 + 3, upgraded to four-of-a-kind
            handType = 'four-of-a-kind';
          }
          break;
        }
        break;
      }
      // no joker
      handType = 'full-house';
      for (const [card, freq] of cardsFreqs) {
        if (freq === 4) {
          handType = 'four-of-a-kind';
        }
      }
      break;
    }

    default:
      throw 'error';
  }

  return handsTypes.findIndex((elt) => elt === handType);
}

/**
 *
 * @param {Hand[]} hands
 * @returns {Hand[]}
 */
export function sortHands(hands) {
  const sortedHands = hands.toSorted((cardA, cardB) => {
    // hand types are ranked from weakest to strongest
    const handTypeDiff = cardA.type - cardB.type;
    if (handTypeDiff !== 0) {
      return handTypeDiff;
    } else {
      // same hand type, compare cards one by one to find first strongest card
      for (let i = 0; i < cardA.cards.length; i++) {
        const cardNbDiff = cardA.cards[i] - cardB.cards[i];
        if (cardNbDiff !== 0) {
          return cardNbDiff;
        }
      }
      return 0; // should never reach this case if all hands are different
    }
  });
  return sortedHands;
}
