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

