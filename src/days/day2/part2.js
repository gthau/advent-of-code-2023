import { readFile } from '../../utils/input.utils.js';

// in each game you played,
// what is the fewest number of cubes of each color that could have been in the bag to make the game possible?
// The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together.
// The power of the minimum set of cubes in game 1 is 48.
// In games 2-5 it was 12, 1560, 630, and 36, respectively.
// Adding up these five powers produces the sum 2286.

// input like:
// Game 1: 3 blue, 7 green, 10 red; 4 green, 4 red; 1 green, 7 blue, 5 red; 8 blue, 10 red; 7 blue, 19 red, 1 green
// Game 2: 6 red, 10 green; 11 green, 4 red; 16 green, 2 blue; 7 green, 5 blue, 4 red; 17 green, 1 red, 1 blue
// Game 3: 5 red, 9 blue, 1 green; 5 red; 11 red, 2 green, 8 blue; 2 green, 6 blue

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));

  const parsedLines = parseLines(lines);

  const minCubeForAllGames = parsedLines.map((line) =>
    minCubesRequiredByColor(line)
  );

  const cubePowerOfAllGames = minCubeForAllGames.map(
    ({ red, green, blue }) => red * green * blue
  );

  const sumOfCubePowers = cubePowerOfAllGames.reduce(
    (sum, cubePower) => sum + cubePower,
    0
  );
  console.debug(
    `the sum of min cube powers of all games is: ${sumOfCubePowers}`
  );
  return sumOfCubePowers;
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
 */
function minCubesRequiredByColor(gameReveal) {
  let minRed = 0;
  let minGreen = 0;
  let minBlue = 0;

  // game is possible if for all reveals, all picked colors are below or equal to the threshold defined in criteria
  gameReveal.reveals.forEach((reveal) => {
    if (reveal.red && reveal.red > minRed) {
      minRed = reveal.red;
    }
    if (reveal.green && reveal.green > minGreen) {
      minGreen = reveal.green;
    }
    if (reveal.blue && reveal.blue > minBlue) {
      minBlue = reveal.blue;
    }
  });

  return {
    red: minRed,
    green: minGreen,
    blue: minBlue,
  };
}

main();
