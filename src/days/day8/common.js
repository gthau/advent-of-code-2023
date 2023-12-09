import { lcm } from '../../utils/input.utils.js';

/**
 *
 * @param {string[]} lines
 * @returns {[number[], Record<string, [string, string]>]}
 */
export function parseInput(lines) {
  const instructionsSeq = lines[0].split('').map((c) => (c === 'L' ? 0 : 1));

  /** @type {Record<string, [string, string]>} */
  const instructions = {};

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    const key = line.substring(0, 3);
    const left = line.substring(7, 10);
    const right = line.substring(12, 15);

    instructions[key] = [left, right];
  }

  return [instructionsSeq, instructions];
}

/**
 *
 * @param {number[]} instructionsSeq
 * @param {Record<string, [string, string]>} instructionsMap
 * @returns {number}
 */
export function computeNbStepsPart1(instructionsSeq, instructionsMap) {
  let step = 'AAA';
  let nbSteps = 0;

  while (step !== 'ZZZ') {
    step =
      instructionsMap[step][instructionsSeq[nbSteps % instructionsSeq.length]];
    nbSteps++;
  }

  return nbSteps;
}

/**
 *
 * @param {string[]} lines
 * @returns {{
 *   instructionsSeq: number[];
 *   instructionsMap: Record<string, [string, string]>;
 *   startingPoints: string[];
 * }}
 */
export function parseInput2(lines) {
  const instructionsSeq = lines[0].split('').map((c) => (c === 'L' ? 0 : 1));

  /** @type {Record<string, [string, string]>} */
  const instructionsMap = {};

  const startingPoints = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    const key = line.substring(0, 3);
    const left = line.substring(7, 10);
    const right = line.substring(12, 15);

    instructionsMap[key] = [left, right];

    if (key.endsWith('A')) {
      startingPoints.push(key);
    }
  }

  return { instructionsSeq, instructionsMap, startingPoints };
}

/**
 * This solution is correct but due to large input with loops, it would take
 * more than half a day to run (other people brut-force solution in Rust took 10h)
 * @param {number[]} instructionsSeq
 * @param {Record<string, [string, string]>} instructionsMap
 * @param {string[]} startingPoints
 * @returns {number}
 */
export function computeNbStepsPart2(
  instructionsSeq,
  instructionsMap,
  startingPoints
) {
  const steps = [...startingPoints];
  let nbSteps = 0;
  let step = '';
  let instruction = -1;
  let instructionNb = 0;

  while (steps.some((s) => s[2] !== 'Z')) {
    instruction = instructionsSeq[instructionNb];

    for (let i = 0; i < steps.length; i++) {
      step = steps[i];
      steps[i] = instructionsMap[step][instruction];
    }

    nbSteps++;
    instructionNb++;
    if (instructionNb === instructionsSeq.length) {
      instructionNb = 0;
    }
  }

  return nbSteps;
}

/**
 * Due to "lucky" input assumption based on the sample input, the lowest common
 * multiplier of each nb of steps to reach a step ending in 'Z' works on the input
 * but only because the input is shaped in a particular way (it's uncommon in Advent of Code
 * to make this assumption)
 * @param {number[]} instructionsSeq
 * @param {Record<string, [string, string]>} instructionsMap
 * @param {string[]} startingPoints
 * @returns {number}
 */
export function computeNbStepsPart2LCM(
  instructionsSeq,
  instructionsMap,
  startingPoints
) {
  const steps = [...startingPoints];
  let nbSteps = 0;
  let step = '';
  let instruction = -1;
  let instructionNb = 0;
  const stepsToReachZ = new Array(startingPoints.length).fill(0);

  // while (steps.some((s) => s[2] !== 'Z')) {
  while (stepsToReachZ.some((s) => s === 0)) {
    instruction = instructionsSeq[instructionNb];

    for (let i = 0; i < steps.length; i++) {
      if (stepsToReachZ[i] > 0) {
        // already found an end node for this start point
        continue;
      }

      step = steps[i];

      // save nb of steps to reach first "end" point
      if (step[2] === 'Z') {
        stepsToReachZ[i] = nbSteps;
      }

      steps[i] = instructionsMap[step][instruction];
    }

    nbSteps++;
    instructionNb++;
    if (instructionNb === instructionsSeq.length) {
      instructionNb = 0;
    }
  }

  // found nb of steps to reach each end point for each start point
  // find their Lowest Common Multiplier
  return stepsToReachZ.reduce(lcm);
}
