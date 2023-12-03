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

  for (const char of line) {
    const parsedChar = parseInt(char, 10);
    if (!isNaN(parsedChar)) {
      firstDigit ||= parsedChar;
      lastDigit = parsedChar;
    }
  }

  const calibration = firstDigit * 10 + lastDigit;
  console.log(`${line.padEnd(50, ' ')} --> ${calibration}`);
  return calibration;
}

main();
