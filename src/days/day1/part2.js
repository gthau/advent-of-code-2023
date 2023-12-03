import { readFileSync } from 'node:fs';

function main() {
  const lines = readFile('./input.txt');

  const calibrations = lines.map(computeCode);

  const total = calibrations.reduce((a, b) => a + b, 0);
  console.log(`total = ${total}`);

  return total;
}

/**
 *
 * @param {string} path
 * @returns {string[]}
 */
function readFile(path) {
  return readFileSync(path).toString().split('\n');
}

/**
 *
 * @param {string} line
 * @param {number} index
 * @param {string[]} array
 * @returns {number}
 */
function computeCode(line, index, array) {
  let firstDigit = 0;
  let lastDigit = 0;
  let acc = '';

  for (const char of line) {
    const parsedChar = parseInt(char, 10);
    if (!isNaN(parsedChar)) {
      firstDigit ||= parsedChar;
      lastDigit = parsedChar;
      acc = '';
    } else {
      // accumulate chars and check if it's a written digit
      acc += char;
      const parsedChar = parseStringAsDigit(acc);
      if (!isNaN(parsedChar)) {
        firstDigit ||= parsedChar;
        lastDigit = parsedChar;
        // acc = ''; // don't reset acc, case  oneight  should return 8, not 1
      }
    }
  }

  const calibration = firstDigit * 10 + lastDigit;
  console.log(`${line.padEnd(50, ' ')} --> ${calibration}`);
  return calibration;
}

const writtenDigitToDigit = /** @type {const} */ ([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

/**
 *
 * @param {string} str
 * @returns {number}
 */
function parseStringAsDigit(str) {
  for (const [writtenDigit, digit] of writtenDigitToDigit) {
    if (str.endsWith(writtenDigit)) {
      return digit;
    }
  }
  return NaN;
  // switch (str) {
  //   case 'one':
  //     return 1;
  //   case 'two':
  //     return 2;
  //   case 'three':
  //     return 3;
  //   case 'four':
  //     return 4;
  //   case 'five':
  //     return 5;
  //   case 'six':
  //     return 6;
  //   case 'seven':
  //     return 7;
  //   case 'eight':
  //     return 8;
  //   case 'night':
  //     return 9;
  //   default:
  //     return NaN;
  // }
}

main();
