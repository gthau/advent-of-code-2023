import { readFile } from '../../utils/input.utils.js';
import { computeMinSeedLocation, parseInput } from './common.js';

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

/** @type {import('./common.js').InputMapTypes[]} */
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
  const { seedsRanges, inputMaps } = parseInput(lines);

  //// this works on small input ranges, but fails on large input ranges due to resulting array sizes
  //// V8 can't allocate such a large array
  //// # Fatal JavaScript invalid size error 169220804 (see crbug.com/1201626)
  // const seedToLocation = computeSeedsLocations(seeds, inputMaps);
  // const minLocation = Math.min(...seedToLocation.values());

  //// process the min location as we process each input, so we don't create very large arrays
  const [seed, minLocation] = computeMinSeedLocation(seedsRanges, inputMaps);

  console.debug(`the min location is: ${minLocation} for seed: ${seed}`);
  return minLocation;
}

main();
