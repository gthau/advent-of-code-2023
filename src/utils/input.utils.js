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
 * @returns {string} str
 */
export function nbArrToStr(nbArray) {
  return nbArray.reduce((acc, nb) => acc + `${nb}`, '');
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

/**
 *
 * @param {number} a
 * @param {number} b
 * @returns number
 */
// @ts-ignore
export function gcd(a, b) {
  return a ? gcd(b % a, a) : b;
}

/**
 *
 * @param {number} a
 * @param {number} b
 * @returns number
 */
export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}
