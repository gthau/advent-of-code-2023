import { strToNbArr } from '../../utils/input.utils.js';

/**
 * @typedef {{
 *   time: number;
 *   distance: number;
 * }} RaceRequirements
 */

/**
 *
 * @param {string[]} lines
 * @returns {RaceRequirements[]}
 */
export function parseInput([timesLine, distancesLine, ...rest]) {
  const times = strToNbArr(timesLine.split('Time:')[1]);
  const distances = strToNbArr(distancesLine.split('Distance:')[1]);

  const racesReqs = [];
  for (const [idx, time] of times.entries()) {
    racesReqs.push({
      time,
      distance: distances[idx],
    });
  }

  return racesReqs;
}

/**
 *
 * @param {number} raceTime
 * @param {number} chargingTime
 * @returns {number} the distance reached
 */
export function computeDistance(raceTime, chargingTime) {
  return (raceTime - chargingTime) * chargingTime;
}

/**
 *
 * @param {RaceRequirements} raceReqs
 * @returns {number} the number of ways to win the race
 */
export function computeWaysToWinRace({
  time: raceTime,
  distance: raceDistance,
}) {
  let nbWaysToWinRace = 0;

  for (let chargingTime = 1; chargingTime < raceTime; chargingTime++) {
    if (computeDistance(raceTime, chargingTime) > raceDistance) {
      nbWaysToWinRace++;
    } else {
      // the ways of winning follow a gauss distribution,
      // once we fall out of the winning interval, no subsequent input will
      // result in a win, we can break out of the loop
      if (nbWaysToWinRace > 0) {
        break;
      }
    }
  }

  return nbWaysToWinRace;
}
