import { readFile } from '../../utils/input.utils.js';

// Determine which games would have been possible
// if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes.
// What is the sum of the IDs of those games?
//
// input like:
// Game 1: 3 blue, 7 green, 10 red; 4 green, 4 red; 1 green, 7 blue, 5 red; 8 blue, 10 red; 7 blue, 19 red, 1 green
// Game 2: 6 red, 10 green; 11 green, 4 red; 16 green, 2 blue; 7 green, 5 blue, 4 red; 17 green, 1 red, 1 blue
// Game 3: 5 red, 9 blue, 1 green; 5 red; 11 red, 2 green, 8 blue; 2 green, 6 blue

const gameCriteria = /** @type {const} */ { red: 12, green: 13, blue: 14 };

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));

  const parsedLines = parseLines(lines);

  const possibleGames = parsedLines.filter((line) =>
    isGamePossible(line, gameCriteria)
  );

  const sumOfGamesId = possibleGames.reduce(
    (sum, { gameId }) => sum + gameId,
    0
  );
  console.debug(`the sum of ids of the possible games is: ${sumOfGamesId}`);
  return sumOfGamesId;
}

/**
 * @typedef {Object} OneRevealOfRGB
 * @property {number=} red
 * @property {number=} green
 * @property {number=} blue
 */

/**
 * @typedef {Object} OneGameReveals
 * @property {number} gameId
 * @property {OneRevealOfRGB[]} reveals
 */

/**
 *
 * @param {string[]} lines
 * @returns {OneGameReveals[]}
 */
function parseLines(lines) {
  return lines.map(parseLine);
}

/**
 *
 * @param {string} line
 * @returns {OneGameReveals}
 */
function parseLine(line) {
  const [gameStr, revealsStr] = line.split(': ');
  const gameId = parseInt(gameStr.substring(5), 10); // remove 'Game '
  const revealsStrArr = revealsStr.split('; '); // e.g. ['9 blue, 4 green, 6 red', '2 red, 4 green']

  const reveals = revealsStrArr.map((revealStr) => {
    // e.g. '2 red, 4 green'
    return Object.fromEntries(
      revealStr.split(', ').map((oneColorReveal) => {
        // e.g. '2 red'
        const [nb, color] = oneColorReveal.split(' ');
        return [color, parseInt(nb, 10)];
      })
    );
  });

  const gameReveals = { gameId, reveals };
  console.debug(JSON.stringify(gameReveals));
  return gameReveals;
}

/**
 *
 * @param {OneGameReveals} gameReveal
 * @param {typeof gameCriteria} criteria
 */
function isGamePossible(gameReveal, criteria) {
  // game is possible if for all reveals, all picked colors are below or equal to the threshold defined in criteria
  return gameReveal.reveals.every((reveal) => {
    return (
      (reveal.red ?? 0) <= criteria.red &&
      (reveal.green ?? 0) <= criteria.green &&
      (reveal.blue ?? 0) <= criteria.blue
    );
  });
}

main();
