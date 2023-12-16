/** @typedef {string[][] | string[]} Cosmos */
/** @typedef {[number, number ]} Position */
/** @typedef {{id: number; position: Position}} Galaxy */

/**
 *
 * @param {string[]} cosmos
 * @returns {Cosmos}
 */
export function expandCosmos(cosmos) {
  let noGalaxyInRow = true;

  // first pass expansion: translate the cosmos (x becomes y) and duplicate columns with no galaxies
  const firstPassExpansion = [];
  for (let i = cosmos[0].length - 1; i > -1; i--) {
    const row = [];
    for (let j = 0; j < cosmos.length; j++) {
      const elt = cosmos[j][i];
      row.push(elt);
      if (elt === '#') {
        noGalaxyInRow = false;
      }
    }

    firstPassExpansion.push(row);
    if (noGalaxyInRow) {
      firstPassExpansion.push(row);
    }
    noGalaxyInRow = true;
  }

  // second pass expansion: translate the cosmos (y returns to x) and duplicate rows with no galaxies
  const secondPassExpansion = [];

  for (let i = 0; i < firstPassExpansion[0].length; i++) {
    const row = [];
    for (let j = firstPassExpansion.length - 1; j > -1; j--) {
      const elt = firstPassExpansion[j][i];
      row.push(elt);
      if (elt === '#') {
        noGalaxyInRow = false;
      }
    }

    secondPassExpansion.push(row);
    if (noGalaxyInRow) {
      secondPassExpansion.push(row);
    }
    noGalaxyInRow = true;
  }

  return secondPassExpansion;
}

/**
 * Expands cosmos and compute Galaxies position in one iteration
 * @param {string[]} cosmos
 * @returns {{ expandedCosmos: Cosmos; galaxies: Galaxy[]}}
 */
export function expandCosmosWithGalaxy(cosmos) {
  let galaxyInRow = false;

  /** @type {Galaxy[]} */
  const galaxies = [];

  // first pass expansion: translate the cosmos (x becomes y) and duplicate columns with no galaxies
  const firstPassExpansion = [];
  for (let x = cosmos[0].length - 1; x > -1; x--) {
    const row = [];
    for (let y = 0; y < cosmos.length; y++) {
      const elt = cosmos[y][x];
      row.push(elt);
      if (elt === '#') {
        galaxyInRow = true;
      }
    }

    firstPassExpansion.push(row);
    if (!galaxyInRow) {
      firstPassExpansion.push(row);
    }
    galaxyInRow = false;
  }

  // second pass expansion: translate the cosmos (y returns to x) and duplicate rows with no galaxies
  const secondPassExpansion = [];
  let addedRows = 0;
  let galaxyId = 0;

  for (let x = 0; x < firstPassExpansion[0].length; x++) {
    const row = [];
    for (let y = firstPassExpansion.length - 1; y > -1; y--) {
      const elt = firstPassExpansion[y][x];
      row.push(elt);
      if (elt === '#') {
        galaxyInRow = true;
        galaxies.push({
          id: galaxyId++,
          // we're translating the array (x becomes y again):
          position: [
            // offset the new y with the numbers of duplicated rows
            x + addedRows,
            // compute the new x because we're looping on the column end-to-beginning
            firstPassExpansion.length - 1 - y,
          ],
        });
      }
    }

    secondPassExpansion.push(row);
    if (!galaxyInRow) {
      secondPassExpansion.push(row);
      addedRows++;
    }
    galaxyInRow = false;
  }

  return { expandedCosmos: secondPassExpansion, galaxies };
}

/**
 *
 * @param {string[] | string[][]} cosmos
 */
export function printCosmos(cosmos) {
  for (let i = 0; i < cosmos.length; i++) {
    const row = cosmos[i];
    if (typeof row === 'string') {
      console.log(row);
    } else {
      console.log(row.join(''));
    }
  }
}

/**
 *
 * @param {Galaxy[]} galaxies
 * @returns {[number, number][]}
 */
export function computeGalaxyPairs(galaxies) {
  /** @type {ReturnType<typeof computeGalaxyPairs>} */
  const pairs = [];

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      pairs.push([i, j]);
    }
  }

  return pairs;
}

/**
 *
 * @param {Position} gPos1
 * @param {Position} gPos2
 * @returns {number}
 */
export function computeDistance(gPos1, gPos2) {
  return Math.abs(gPos2[1] - gPos1[1]) + Math.abs(gPos2[0] - gPos1[0]);
}

// part 2
/**
 *
 * @param {Cosmos} cosmos
 * @param {number} expansion
 * @returns {{
 *  originalGalaxies: Galaxy[];
 *  shiftedGalaxies: Galaxy[];
 *  imgToRealPositions: {
 *    y: number[];
 *    x: number[];
 *  }
 * }}
 */
export function computeExpansionAndGalaxyPositions(
  cosmos,
  expansion = 1_000_000
) {
  let shouldExpand = true;
  let galaxyId = 0;

  /** @type {Galaxy[]} */
  const galaxies = [];

  /** @type {number[]} */
  const yMap = [];

  /** @type {number[]} */
  const xMap = [];

  // first loop on rows, determine y real positions and galaxies' positions
  for (let y = 0; y < cosmos.length; y++) {
    yMap.push(
      y === 0
        ? // 0 is always at position 0
          0
        : // next position is previous position + 1 OR expansion if the previous row had no galaxy
          yMap[y - 1] + (shouldExpand ? expansion : 1)
    );

    shouldExpand = true;

    for (let x = 0; x < cosmos[y].length; x++) {
      const elt = cosmos[y][x];

      if (elt === '#') {
        shouldExpand = false;
        galaxies.push({ id: galaxyId++, position: [y, x] });
      }
    }
  }

  // second loop on the columns, determine x real positions
  for (let x = 0; x < cosmos[0].length; x++) {
    xMap.push(
      x === 0
        ? // 0 is always at position 0
          0
        : // next position is previous position + 1 OR expansion if the previous row had no galaxy
          xMap[x - 1] + (shouldExpand ? expansion : 1)
    );

    shouldExpand = true;

    for (let y = 0; y < cosmos.length; y++) {
      const elt = cosmos[y][x];

      if (elt === '#') {
        shouldExpand = false;
      }
    }
  }

  const shiftedGalaxies = galaxies.map(({ id, position }) => ({
    id,
    // prettier-ignore
    position: /** @type {Position} */ ([
      yMap[position[0]],
      xMap[position[1]]
    ]),
  }));

  return {
    originalGalaxies: galaxies,
    shiftedGalaxies,
    imgToRealPositions: { x: xMap, y: yMap },
  };
}
