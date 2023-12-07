import { readFile, strToNbArr } from '../../utils/input.utils.js';

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

/** @type {InputMapTypes[]} */
const steps = [
  'seed-to-soil',
  'soil-to-fertilizer',
  'fertilizer-to-water',
  'water-to-light',
  'light-to-temperature',
  'temperature-to-humidity',
  'humidity-to-location',
];

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));
  const { seeds, inputMaps } = parseInput(lines);

  const seedToLocation = computeSeedsLocations(seeds, inputMaps);
  const minLocation = Math.min(...seedToLocation.values());

  console.debug(`the min location is: ${minLocation}`);
  return minLocation;
}

main();

/**
 * @typedef {'seed-to-soil'
 *  | 'soil-to-fertilizer'
 *  | 'fertilizer-to-water'
 *  | 'water-to-light'
 *  | 'light-to-temperature'
 *  | 'temperature-to-humidity'
 *  | 'humidity-to-location'
 * } InputMapTypes
 */

/**
 * @typedef {{
 *   sourceRangeStart: number;
 *   targetRangeStart: number;
 *   rangeLength: number;
 * }} InputMapEntry
 */

/**
 * @typedef {{
 *   targetMap: InputMapTypes | 'none';
 *   entries: InputMapEntry[];
 * }} InputMap
 */

/**
 * @typedef {Record<InputMapTypes, InputMap>} InputMaps
 */

/**
 *
 * @param {string[]} lines
 * @returns {{ seeds: number[], inputMaps: InputMaps }}
 */
function parseInput(lines) {
  /** @type {number[]} */
  let seeds = [];

  /** @type {InputMapTypes} */
  let inputType = 'seed-to-soil';

  /** @type {InputMaps} */
  const inputMaps = {
    'seed-to-soil': { targetMap: 'soil-to-fertilizer', entries: [] },
    'soil-to-fertilizer': { targetMap: 'fertilizer-to-water', entries: [] },
    'fertilizer-to-water': { targetMap: 'water-to-light', entries: [] },
    'water-to-light': { targetMap: 'light-to-temperature', entries: [] },
    'light-to-temperature': {
      targetMap: 'temperature-to-humidity',
      entries: [],
    },
    'temperature-to-humidity': {
      targetMap: 'humidity-to-location',
      entries: [],
    },
    'humidity-to-location': { targetMap: 'none', entries: [] },
  };

  for (const line of lines) {
    switch (true) {
      case line.length === 0: {
        // ignore empty lines
        break;
      }

      case line.startsWith('seeds: '): {
        const seedsRanges = strToNbArr(line.substring(7));
        seeds = seedsRangesToSeeds(seedsRanges);
        break;
      }

      case line.startsWith('seed-to-soil'): {
        inputType = 'seed-to-soil';
        break;
      }

      case line.startsWith('soil-to-fertilizer'): {
        inputType = 'soil-to-fertilizer';
        break;
      }

      case line.startsWith('fertilizer-to-water'): {
        inputType = 'fertilizer-to-water';
        break;
      }

      case line.startsWith('water-to-light'): {
        inputType = 'water-to-light';
        break;
      }

      case line.startsWith('light-to-temperature'): {
        inputType = 'light-to-temperature';
        break;
      }

      case line.startsWith('temperature-to-humidity'): {
        inputType = 'temperature-to-humidity';
        break;
      }

      case line.startsWith('humidity-to-location'): {
        inputType = 'humidity-to-location';
        break;
      }

      default: {
        // process maps according to input map type
        const [targetRangeStart, sourceRangeStart, rangeLength] =
          strToNbArr(line);
        inputMaps[inputType].entries.push({
          sourceRangeStart,
          targetRangeStart,
          rangeLength,
        });
      }
    }
  }

  return { seeds, inputMaps };
}

/**
 *
 * @param {number[]} seeds
 * @param {InputMaps} inputMaps
 * @returns {Map<number, number>} Map seed to location
 */
function computeSeedsLocations(seeds, inputMaps) {
  return new Map(
    seeds.map((seed) => [seed, computeOneSeedLocation(seed, inputMaps)])
  );
}

/**
 *
 * @param {number} seed
 * @param {InputMaps} inputMaps
 * @returns {number} Map seed to location
 */
function computeOneSeedLocation(seed, inputMaps) {
  let nextStepNb = seed;

  for (const step of steps) {
    nextStepNb = computeStepDestinationNb(nextStepNb, inputMaps[step]);
  }

  return nextStepNb;
}

/**
 *
 * @param {number} sourceNb
 * @param {InputMap} inputMap
 * @returns {number} Map seed to location
 */
function computeStepDestinationNb(sourceNb, inputMap) {
  for (const {
    sourceRangeStart,
    targetRangeStart,
    rangeLength,
  } of inputMap.entries) {
    if (
      sourceNb >= sourceRangeStart &&
      sourceNb < sourceRangeStart + rangeLength
    ) {
      return targetRangeStart + (sourceNb - sourceRangeStart);
    }
  }

  // if sourceNb does not belong to a range, then targetNb = sourceNb
  return sourceNb;
}

/**
 *
 * @param {number[]} seedsRanges
 * @returns {number[]}
 */
function seedsRangesToSeeds(seedsRanges) {
  // seeds comes in pair [x, y], x is the start of the range, y is the length
  // the resulting range is [x, ...., x + y - 1];
  const seeds = [];

  for (let i = 0; i < seedsRanges.length; i = i + 2) {
    const seedRangeStart = seedsRanges[i];
    const seedRangeLength = seedsRanges[i + 1];

    for (let j = 0; j < seedRangeLength; j++) {
      seeds.push(seedRangeStart + j);
    }
  }

  return seeds;
}
