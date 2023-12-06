import { readFile } from '../../utils/input.utils.js';

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
// In this schematic, two numbers are not part numbers because they are not adjacent to a symbol:
// 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number;
// their sum is 4361.

// look around moves [lines (height), position in line (width)]
// prettier-ignore
const lookAroundMoves = /** @type {const} */ ([
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],  [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]);

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));
  const numbersWithAdjSymbols = getNumbersWithAdjSymbols(lines);
  console.debug(
    `the numbers with no adjacent symbols are: ${JSON.stringify(
      numbersWithAdjSymbols
    )}`
  );
  const sum = numbersWithAdjSymbols.reduce((acc, nb) => acc + nb, 0);
  console.debug(`the sum is ${sum}`);
  return sum;
}

main();

/**
 *
 * @param {string[]} lines
 * @returns {number[]}
 */
function getNumbersWithAdjSymbols(lines) {
  const engineWidth = lines[0].length;
  const engineHeight = lines.length;
  const numbersWithAdjSymbols = [];

  for (let h = 0; h < engineHeight; h++) {
    // for all lines, parse line and look for number, then around them to find a non-'.' adjacent symbol
    let line = lines[h];
    let currNumber = 0;
    let currNumberLength = 0;
    let currNumberHasAdjSymbol = false;

    for (let w = engineWidth - 1; w > -1; w--) {
      const char = line[w];
      const parsedChar = parseInt(char, 10);

      // char is a number
      if (!isNaN(parsedChar)) {
        currNumber += parsedChar * 10 ** currNumberLength++;

        // check surrounding char to find symbol
        currNumberHasAdjSymbol ||= hasAdjSymbol(
          lines,
          w,
          h,
          engineWidth,
          engineHeight
        );
      }
      // check last number when on symbols OR reaching the end of the line
      if (isNaN(parsedChar) || w === 0) {
        if (currNumberLength > 0) {
          // if we were acumulating a number and that number has adjacent symbols:
          // - save it
          // - reset temp loop variables
          if (currNumberHasAdjSymbol) {
            numbersWithAdjSymbols.push(currNumber);
          }
          currNumberLength = 0;
          currNumber = 0;
          currNumberHasAdjSymbol = false;
        }
      }
    }
  }
  return numbersWithAdjSymbols;
}

/**
 *
 * @param {string} symbol
 * @returns {boolean} whether the symbol is valid (not a digit, not a dot)
 */
function isValidSymbol(symbol) {
  return symbol !== '.' && isNaN(parseInt(symbol, 10));
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
 * @returns {boolean} whether the current position has adjacent symbols
 */
function hasAdjSymbol(engine, w, h, engineWidth, engineHeight) {
  return lookAroundMoves.some(([hMove, wMove]) => {
    const targetH = h + hMove;
    const targetW = w + wMove;

    return (
      isWithinEngineBounds(targetW, targetH, engineWidth, engineHeight) &&
      isValidSymbol(engine[targetH][targetW])
    );
  });
}
