import { readFile } from '../../utils/input.utils.js';

// A gear is any * symbol that is adjacent to exactly two part numbers.
// Its gear ratio is the result of multiplying those two numbers together.
// This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.
// Consider the same engine schematic again:
//
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
//
// In this schematic, there are two gears.
// The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345.
// The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.)
// Adding up all of the gear ratios produces 467835.
// What is the sum of all of the gear ratios in your engine schematic?

// look around moves [lines (height), position in line (width)]
// prettier-ignore
const lookAroundMoves = /** @type {const} */ ([
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],  [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]);

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));

  const gearRatiosArr = getGearRatios(lines);
  console.debug(`the gear ratios are: ${JSON.stringify(gearRatiosArr)}`);

  const sumOfGearRatios = gearRatiosArr.reduce(
    (acc, [gr1, gr2]) => acc + gr1 * gr2,
    0
  );
  console.debug(`the sum is ${sumOfGearRatios}`);

  return sumOfGearRatios;
}

main();

/**
 *
 * @param {string[]} lines
 * @returns {[number, number][]}
 */
function getGearRatios(lines) {
  const engineWidth = lines[0].length;
  const engineHeight = lines.length;

  /** @type {Map<string, number[]>} */
  const starCoordsToAdjacentNbs = new Map();

  for (let h = 0; h < engineHeight; h++) {
    // for all lines, parse line and look for number, then around them to find a '*' adjacent symbol
    let line = lines[h];
    let currNumber = 0;
    let currNumberLength = 0;
    let currCoordsOfAdjStar = new Set();

    for (let w = engineWidth - 1; w > -1; w--) {
      const char = line[w];
      const parsedChar = parseInt(char, 10);

      // char is a number
      if (!isNaN(parsedChar)) {
        currNumber += parsedChar * 10 ** currNumberLength++;

        // check surrounding char to find adjacent *
        // (we might save several times the coords of the same star, it's ok we account for it when we save the number)
        const coordsOfAdjStarForCurrChar = coordsOfAdjStar(
          lines,
          w,
          h,
          engineWidth,
          engineHeight
        );
        coordsOfAdjStarForCurrChar.forEach((coords) =>
          currCoordsOfAdjStar.add(coords)
        );
      }

      // check last number when on symbols OR reaching the end of the line
      if (isNaN(parsedChar) || w === 0) {
        if (currNumberLength > 0) {
          // if we were acumulating a number and that number has adjacent * symbols:
          // - associate the number to each coords of an adjacent *
          // - reset temp loop variables
          if (currCoordsOfAdjStar.size) {
            saveStarCoordsToMap(
              currCoordsOfAdjStar,
              currNumber,
              starCoordsToAdjacentNbs
            );
          }
          currNumber = 0;
          currNumberLength = 0;
          currCoordsOfAdjStar.clear();
        }
      }
    }
  }

  // find the gears ratios
  const gearRatios = [];

  for (const numbers of starCoordsToAdjacentNbs.values()) {
    if (numbers.length === 2) {
      gearRatios.push(/** @type {[number, number]} */ (numbers));
    }
  }

  return gearRatios;
}

/**
 *
 * @param {number} w
 * @param {number} h
 * @param {number} engineWidth
 * @param {number} engineHeight
 * @returns {boolean} whether the current position is within the engine bounds
 */
function isWithinEngineBounds(w, h, engineWidth, engineHeight) {
  return w > -1 && w < engineWidth && h > -1 && h < engineHeight;
}

/**
 *
 * @param {string[]} engine
 * @param {number} w
 * @param {number} h
 * @param {number} engineWidth
 * @param {number} engineHeight
 * @returns {string[]} the coords 'x,y' of an adjacent * symbol
 */
function coordsOfAdjStar(engine, w, h, engineWidth, engineHeight) {
  const starCoords = [];

  for (const [hMove, wMove] of lookAroundMoves) {
    const targetH = h + hMove;
    const targetW = w + wMove;

    if (
      isWithinEngineBounds(targetW, targetH, engineWidth, engineHeight) &&
      engine[targetH][targetW] === '*'
    ) {
      starCoords.push(`w=${targetW},h=${targetH}`);
    }
  }
  return starCoords;
}

/**
 *
 * @param {Set<string>} currCoordsOfAdjStar
 * @param {number} currNumber
 * @param {Map<string, number[]>} starCoordsToAdjacentNbs
 */
function saveStarCoordsToMap(
  currCoordsOfAdjStar,
  currNumber,
  starCoordsToAdjacentNbs
) {
  for (const coords of currCoordsOfAdjStar) {
    // dedupe the * coords saved multiple times
    const numsForCoords = starCoordsToAdjacentNbs.get(coords);
    if (!numsForCoords) {
      starCoordsToAdjacentNbs.set(coords, [currNumber]);
    } else {
      numsForCoords.push(currNumber);
    }
  }
}
