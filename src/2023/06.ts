import Task, { TaskPartSolution } from "../utils/task.js";

interface Race {
  time: number;
  distance: number;
}

const parseRaces = (input: string): Race[] => {
  const [times, distances] = input.split("\n").map((r) =>
    r
      .split(":")[1]
      .trim()
      .split(/\W+/)
      .map((s) => Number(s.trim()))
  );
  return times.map((time, i) => ({ time, distance: distances[i] }));
};

const parseRace = (input: string): Race => {
  const [time, distance] = input.split("\n").map((r) => Number(r.split(":")[1].trim().replaceAll(/\W+/g, "")));
  return { time, distance };
};

const getSolutionsForRace = (race: Race): number => {
  let n = 0;
  for (let i = 0; i < race.time; i++) {
    const d = i * (race.time - i);
    if (d > race.distance) {
      n++;
    }
    // if (i % 100000 === 0) {
    //   console.log(i, d, d > race.distance);
    // }
  }
  return n;
};

const part1: TaskPartSolution = (input) => {
  const races = parseRaces(input);
  const nums = races.map((r) => getSolutionsForRace(r));
  // console.log(nums);
  return nums.reduce((acc, n) => acc * n, 1);
};
const part2: TaskPartSolution = (input) => {
  const race = parseRace(input);
  const n = getSolutionsForRace(race);
  // console.log(n);
  return n;
};

const task = new Task(2023, 6, part1, part2, {
  part1: {
    input: `Time:      7  15   30
Distance:  9  40  200`,
    result: "288",
  },
  part2: {
    input: `Time:      7  15   30
Distance:  9  40  200`,
    result: "71503",
  },
});

export default task;
