import { readFile } from '../../utils/input.utils.js';
import {
  findFarthestElementInLoop as findFarthestDistance,
  parseInput,
} from './common.js';

// The pipes are arranged in a two-dimensional grid of tiles:
//
// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
// Based on the acoustics of the animal's scurrying, you're confident the pipe that contains the animal is one large, continuous loop.
//
// In the first example with the square loop:
//
// .....
// .S-7.
// .|.|.
// .L-J.
// .....
// You can count the distance each tile in the loop is from the starting point like this:
//
// .....
// .012.
// .1.3.
// .234.
// .....
// In this example, the farthest point from the start is 4 steps away.
//
// Here's the more complex loop again:
//
// ..F7.
// .FJ|.
// SJ.L7
// |F--J
// LJ...
// Here are the distances for each tile on that loop:
//
// ..45.
// .236.
// 01.78
// 14567
// 23...
// Find the single giant loop starting at S. How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?

function main() {
  const lines = readFile(new URL('input.txt', import.meta.url));
  const startPosition = parseInput(lines);

  const maxDistance = findFarthestDistance(lines, startPosition);
  console.debug(`max distance: ${maxDistance}`);
}

main();
