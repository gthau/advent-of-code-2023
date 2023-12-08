import { mult, readFile } from '../../utils/input.utils.js';
import {
  computeWaysToWinRace,
  computeWaysToWinRace2,
  parseInput,
  parseInput2,
} from './common.js';

// As the race is about to start, you realize the piece of paper with race times and record distances you got earlier actually just has very bad kerning. There's really only one race - ignore the spaces between the numbers on each line.

// So, the example from before:

// Time:      7  15   30
// Distance:  9  40  200
// ...now instead means this:

// Time:      71530
// Distance:  940200
// Now, you have to figure out how many ways there are to win this single race. In this example, the race lasts for 71530 milliseconds and the record distance you need to beat is 940200 millimeters. You could hold the button anywhere from 14 to 71516 milliseconds and beat the record, a total of 71503 ways!

// How many ways can you beat the record in this one much longer race?

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));
  const raceReqs = parseInput2(lines);

  const waysToWinRaces = computeWaysToWinRace2(raceReqs);
  console.debug(waysToWinRaces);
}

main();
