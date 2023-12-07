import { Worker } from 'node:worker_threads';
import { readFile } from '../../utils/input.utils.js';
import { parseInput } from './common.js';

// the seeds: line actually describes ranges of seed numbers.
//
// The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:
//
// seeds: 79 14 55 13
// This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.
//
// Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.
//
// In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.
//
// Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?

async function mainWithWorkers() {
  const lines = readFile(new URL('input.txt', import.meta.url));
  const { seedsRanges, inputMaps } = parseInput(lines);

  const [seed, minLocation] = await computeMinSeedLocationWithWorkers(
    seedsRanges,
    inputMaps
  );

  console.debug(`the min location is: ${minLocation} for seed: ${seed}`);
  return minLocation;
}

await mainWithWorkers();

/**
 *
 * @param {number[]} seedsRanges
 * @param {import('./common.js').InputMaps} inputMaps
 * @returns {Promise<[number, number]>} seed, location
 */
async function computeMinSeedLocationWithWorkers(seedsRanges, inputMaps) {
  let minLocationSeed = -1;
  let minLocation = Number.POSITIVE_INFINITY;

  const workersRuns = [];

  for (let i = 0; i < seedsRanges.length; i = i + 2) {
    const seedRangeStart = seedsRanges[i];
    const seedRangeLength = seedsRanges[i + 1];

    workersRuns.push(runWorker({ seedRangeStart, seedRangeLength, inputMaps }));
  }

  const results = await Promise.all(workersRuns);
  for (const [seed, location] of results) {
    if (location < minLocation) {
      minLocation = location;
      minLocationSeed = seed;
    }
  }

  return [minLocationSeed, minLocation];
}

/**
 *
 * @param {{
 *   seedRangeStart: number;
 *   seedRangeLength: number;
 *   inputMaps: import('./common.js').InputMaps;
 * }} workerData
 * @returns
 */
function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    console.debug(
      `creating worker with rangeStart=${workerData.seedRangeStart} and rangeLength=${workerData.seedRangeLength}`
    );
    const worker = new Worker(new URL('./part2_worker.js', import.meta.url), {
      workerData,
    });

    worker.on('message', ({ data }) => {
      const [minLocationSeed, minLocation] = data;
      console.debug(
        `message from worker: min location: ${minLocation}, seed: ${minLocationSeed}`
      );
      resolve([minLocationSeed, minLocation]);
    });

    worker.on('error', reject);

    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker Thread stopped with exit code ${code}`));
    });
  });
}
