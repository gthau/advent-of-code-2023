import { readFileSync } from 'node:fs';

/**
 *
 * @param {string | URL} path
 * @returns {string[]}
 */
export function readFile(path) {
  return readFileSync(path, 'utf-8').toString().split('\n');
}
