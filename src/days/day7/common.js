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
