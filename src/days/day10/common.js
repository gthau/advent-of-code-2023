/** @typedef {[number, number]} Position */

/**
 *
 * @param {string[]} lines
 * @returns {Position}
 */
export function parseInput(lines) {
  let startPositionX = 0;
  let startPositionY = 0;
  let line;

  for (let y = 0; y < lines.length; y++) {
    line = [];

    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === 'S') {
        startPositionY = y;
        startPositionX = x;
      }
    }
  }
  return [startPositionY, startPositionX];
}

const moves = /** @type {const} */ ({
  north: { move: [-1, 0], validPipes: ['|', 'F', '7'], oppositeMove: 'south' },
  east: { move: [0, 1], validPipes: ['-', 'J', '7'], oppositeMove: 'west' },
  south: { move: [1, 0], validPipes: ['|', 'L', 'J'], oppositeMove: 'north' },
  west: { move: [0, -1], validPipes: ['-', 'F', 'L'], oppositeMove: 'east' },
});

const letters = /** @type {const} */ ({
  F: { allowedMoves: ['east', 'south'] },
  '-': { allowedMoves: ['east', 'west'] },
  // prettier-ignore
  '7': { allowedMoves: ['south', 'west'] },
  '|': { allowedMoves: ['north', 'south'] },
  J: { allowedMoves: ['north', 'west'] },
  L: { allowedMoves: ['east', 'north'] },
});

/** @typedef {keyof typeof moves} MoveDirections */

/**
 *
 * @param {[number, number]} currentPosition
 * @param {string[]} lines
 * @returns {{ moveDirection: MoveDirections, position: Position}[]}
 */
export function findInitialNextDirectionsAndPositions(currentPosition, lines) {
  /** @type {ReturnType<typeof findInitialNextDirectionsAndPositions>} */
  const ret = [];
  /** @type {Position} */
  const bounds = [lines.length, lines[0].length];

  for (const dir of /** @type {MoveDirections[]} */ (Object.keys(moves))) {
    const { move, validPipes } = moves[dir];
    const nextPosition = /** @type {Position} */ ([
      currentPosition[0] + move[0],
      currentPosition[1] + move[1],
    ]);
    if (isInBounds(nextPosition, bounds)) {
      const pipe =
        lines[currentPosition[0] + move[0]][currentPosition[1] + move[1]];
      if (validPipes.find((p) => p === pipe)) {
        ret.push({ moveDirection: dir, position: nextPosition });
      }
    }
  }

  return ret;
}

/**
 *
 * @param {Position} currentPosition
 * @param {MoveDirections} previousDirection
 * @param {string[]} lines
 * @returns {{ moveDirection: MoveDirections, position: Position}}
 */
export function computeNextPosition(currentPosition, previousDirection, lines) {
  /** @type {Position} */
  const bounds = [lines.length, lines[0].length];

  /** @type {ReturnType<typeof computeNextPosition>} */
  const ret = {};

  const currentLetter = /** @type {keyof typeof letters} */ (
    lines[currentPosition[0]][currentPosition[1]]
  );

  for (const dir of /** @type {MoveDirections[]} */ (Object.keys(moves))) {
    if (
      dir !== moves[previousDirection].oppositeMove &&
      letters[currentLetter].allowedMoves.find((d) => d === dir)
    ) {
      const { move, validPipes } = moves[dir];
      const nextPosition = /** @type {Position} */ ([
        currentPosition[0] + move[0],
        currentPosition[1] + move[1],
      ]);
      if (isInBounds(nextPosition, bounds)) {
        const pipe =
          lines[currentPosition[0] + move[0]][currentPosition[1] + move[1]];
        if (validPipes.find((p) => p === pipe)) {
          ret.moveDirection = dir;
          ret.position = nextPosition;
          break;
        }
      }
    }
  }

  return ret;
}

/**
 *
 * @param {Position} position
 * @param {[number, number]} bounds
 * @returns {boolean}
 */
export function isInBounds(position, bounds) {
  return (
    position[0] > -1 &&
    position[0] < bounds[0] &&
    position[1] > -1 &&
    position[1] < bounds[1]
  );
}

/**
 *
 * @param {Position} position
 * @param {MoveDirections} moveDirection
 * @returns {Position}
 */
export function computeMove(position, moveDirection) {
  const { move } = moves[moveDirection];
  const nextPosition = /** @type {Position} */ ([
    position[0] + move[0],
    position[1] + move[1],
  ]);
  return nextPosition;
}

/**
 *
 * @param {Position} position
 * @returns {string}
 */
export function positionKey(position) {
  return `${position[0]}_${position[1]}`;
}

/**
 *
 * @param {string[]} lines
 * @param {[number, number]} startPosition
 * @returns {number}
 */
export function findFarthestElementInLoop(lines, startPosition) {
  let [directionAndPosition1, directionAndPosition2] =
    findInitialNextDirectionsAndPositions(startPosition, lines);
  let direction1Solved = false;
  let direction2Solved = false;
  let { moveDirection: direction1, position: position1 } =
    directionAndPosition1;
  let { moveDirection: direction2, position: position2 } =
    directionAndPosition2;
  let distance1 = 0;
  let distance2 = 0;
  let maxDistance = 0;

  /** @type {Record<string, any>} */
  const visited = {};

  while (!(direction1Solved && direction2Solved)) {
    if (!direction1Solved) {
      const key1 = positionKey(position1);
      const visitedValue = visited[key1];
      if (!visitedValue || distance1 + 1 < visitedValue) {
        visited[key1] = ++distance1;
        maxDistance = Math.max(maxDistance, distance1);
        directionAndPosition1 = computeNextPosition(
          position1,
          direction1,
          lines
        );
        direction1 = directionAndPosition1.moveDirection;
        position1 = directionAndPosition1.position;
      } else {
        direction1Solved = true;
      }
    }

    if (!direction2Solved) {
      const key2 = positionKey(position2);
      const visitedValue = visited[key2];
      if (!visitedValue || distance2 + 1 < visitedValue) {
        visited[key2] = ++distance2;
        maxDistance = Math.max(maxDistance, distance2);
        directionAndPosition2 = computeNextPosition(
          position2,
          direction2,
          lines
        );
        direction2 = directionAndPosition2.moveDirection;
        position2 = directionAndPosition2.position;
      } else {
        direction2Solved = true;
      }
    }
  }

  return maxDistance;
}
