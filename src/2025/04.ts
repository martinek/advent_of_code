import Task, { TaskPartSolution } from "../utils/task.js";

const NEIGHBORS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const count = (map: string): number => {
  const grid = map.split("\n").map((line) => line.split(""));
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") {
        if (NEIGHBORS.map(([dy, dx]) => grid[y + dy]?.[x + dx]).filter((c) => c === "@").length < 4) {
          count++;
        }
      }
    }
  }
  return count;
};

const removable = (grid: string[][]): [number, number][] => {
  const res: [number, number][] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") {
        if (NEIGHBORS.map(([dy, dx]) => grid[y + dy]?.[x + dx]).filter((c) => c === "@").length < 4) {
          res.push([y, x]);
        }
      }
    }
  }
  return res;
};

const part1: TaskPartSolution = (input) => {
  return count(input);
};
const part2: TaskPartSolution = (input) => {
  const grid = input.split("\n").map((line) => line.split(""));

  let total = 0;
  let pending = removable(grid);
  while (pending.length > 0) {
    total += pending.length;

    for (const [y, x] of pending) {
      grid[y][x] = ".";
    }

    pending = removable(grid);
  }

  return total;
};

const task = new Task(2025, 4, part1, part2, {
  part1: {
    input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
    result: "13",
  },
  part2: {
    input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
    result: "43",
  },
});

export default task;
