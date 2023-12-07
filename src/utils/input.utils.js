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
  return str.split(/\s+/).map((nb) => parseInt(nb));
}
