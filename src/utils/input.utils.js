import { readFileSync } from 'node:fs';

/**
 *
 * @param {string | URL} path
 * @returns {string[]}
 */
export function readFile(path) {
  return readFileSync(path, 'utf-8').toString().split('\n');
}

/**
 *
 * @param {string} str
 * @returns {number[]}
 */
export function strToNbArr(str) {
  return str
    .trimStart()
    .split(/\s+/)
    .map((nb) => parseInt(nb));
}

/**
 *
 * @param {number[]} nbArray
 * @returns {number}
 */
export function sum(nbArray) {
  return nbArray.reduce((acc, nb) => acc + nb, 0);
}

/**
 *
 * @param {number[]} nbArray
 * @returns {number}
 */
export function mult(nbArray) {
  return nbArray.reduce((acc, nb) => acc * nb, 1);
}
