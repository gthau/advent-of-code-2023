import { strToNbArr } from '../../utils/input.utils.js';

/**
 *
 * @param {string[]} lines
 * @returns {number[][]}
 */
export function parseInput(lines) {
  return lines.map(strToNbArr);
}

/**
 *
 * @param {string[]} lines
 * @returns {number[][]}
 */
export function parseInput2(lines) {
  return lines.map((line) => strToNbArr(line).reverse());
}

/**
 *
 * @param {number[][]} histories
 * @param {boolean} toFront
 * @returns {number[]}
 */
export function computeLastNumbers(histories, toFront = false) {
  return histories.map((hist) => computeLastNumber(hist, toFront));
}

/**
 *
 * @param {number[]} history
 * @param {boolean} toFront
 * @returns {number}
 */
export function computeLastNumber(history, toFront = false) {
  const diffMult = toFront ? -1 : 1;

  /** @type {number[][]} */
  const sequences = [history];

  // stop processing whenever all values in a sequences are zeroes
  let allZeroes = false;
  /** @type {number[]} */
  let newSequence = [];
  /** @type {number[]} */
  let currSequence = history;
  let diff = 0;

  while (!allZeroes) {
    allZeroes = true;

    for (let i = 1; i < currSequence.length; i++) {
      diff = diffMult * (currSequence[i] - currSequence[i - 1]);
      if (diff !== 0) {
        allZeroes = false;
      }
      newSequence.push(diff);
    }
    sequences.push(newSequence);
    currSequence = newSequence;
    newSequence = [];
  }

  // last sequence is all zeroes
  let processedSequence = /** @type {!number[]} */ (sequences.at(-1));
  processedSequence.push(0);

  /** @type {!number[]} */
  let nextSequence;

  let nextNb = 0;

  for (let j = sequences.length - 2; j > -1; j--) {
    processedSequence = sequences[j];
    nextSequence = sequences[j + 1];
    nextNb =
      /** @type {!number} */ (processedSequence.at(-1)) +
      diffMult * /** @type {!number} */ (nextSequence.at(-1));
    processedSequence.push(nextNb);
  }

  return nextNb;
}
