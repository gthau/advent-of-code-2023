import { parentPort, workerData } from 'node:worker_threads';
import { computeOneSeedLocation } from './common.js';

/**
 *
 * @param {number} seedRangeStart
 * @param {number} seedRangeLength
 * @param {import('./common.js').InputMaps} inputMaps
 * @returns {[number, number]} seed, location
 */
function computeMinSeedLocation(seedRangeStart, seedRangeLength, inputMaps) {
  let seed = -1;
  let minLocationSeed = -1;
  let minLocation = Number.POSITIVE_INFINITY;

  for (let j = 0; j < seedRangeLength; j++) {
    seed = seedRangeStart + j;
    const location = computeOneSeedLocation(seed, inputMaps);
    if (location < minLocation) {
      minLocation = location;
      minLocationSeed = seed;
    }
  }

  return [minLocationSeed, minLocation];
}

export function computeMinSeedLocationWorker() {
  console.debug(
    `in worker with rangeStart=${workerData.seedRangeStart} and rangeLength=${workerData.seedRangeLength}`
  );
  const [minLocationSeed, minLocation] = computeMinSeedLocation(
    workerData.seedRangeStart,
    workerData.seedRangeLength,
    workerData.inputMaps
  );
  parentPort?.postMessage({ data: [minLocationSeed, minLocation] });
}

computeMinSeedLocationWorker();
