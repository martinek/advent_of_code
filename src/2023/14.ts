import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Char = "." | "O" | "#";

const countRow = (r: string): number => {
  const chars = r.split("") as Char[];
  let sum = 0;
  let n = r.length;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === "O") {
      sum += n;
      n--;
    } else if (char === "#") {
      n = r.length - i - 1;
    }
  }
  // console.log(r, sum);
  return sum;
};

const part1: TaskPartSolution = (input) => {
  const grid = rotateCCW(input.split("\n"));
  return SUM(grid.map(countRow));
};

const rotateCCW = (grid: string[]) => {
  const res: string[] = [];
  for (let i = grid[0].length - 1; i >= 0; i--) {
    res.push(grid.map((r) => r[i]).join(""));
  }
  return res;
};

const ROTATE_CACHE: Record<string, string[]> = {};
const rotateCW = (grid: string[]) => {
  const key = grid.join("\n");
  if (ROTATE_CACHE[key]) {
    // console.log("cachehit");
    return ROTATE_CACHE[key];
  }
  const res: string[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    res.push(
      grid
        .map((r) => r[i])
        .reverse()
        .join("")
    );
  }
  ROTATE_CACHE[key] = res;
  return res;
};

const MOVE_CACHE: Record<string, string> = {};

const moveToStart = (r: string): string => {
  if (MOVE_CACHE[r]) {
    return MOVE_CACHE[r];
  }
  const chars = r.split("") as Char[];
  let res = "";
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === "O") {
      res += "O";
    }
    if (char === "#") {
      // fill in gap with dots
      const rem = i - res.length;
      for (let j = 0; j < rem; j++) {
        res += ".";
      }
      res += "#";
    }
  }
  const rem = chars.length - res.length;
  for (let j = 0; j < rem; j++) {
    res += ".";
  }
  MOVE_CACHE[r] = res;
  return res;
};

const cycle = (grid: string[]) => {
  let g = grid;
  for (let i = 0; i < 4; i++) {
    g = g.map(moveToStart);
    g = rotateCW(g);
    // console.log(countGrid(g));
  }
  return g;
};

const simpleCountRow = (row: string): number => {
  return row
    .split("")
    .reverse()
    .map((c, i) => (c === "O" ? i + 1 : 0))
    .reduce((acc, a) => acc + a);
};

const countGrid = (grid: string[]): number => {
  return SUM(grid.map(simpleCountRow));
};

const PREV: Set<string> = new Set();
const PREV_LIST: string[] = [];

const CYCLES = 1000000000;
const part2: TaskPartSolution = (input) => {
  let grid = rotateCCW(input.split("\n"));
  // printGrid(rotateCW(grid));

  let rem = 0;
  PREV.add(grid.join("\n"));
  PREV_LIST.push(grid.join("\n"));
  for (let i = 1; i < CYCLES; i++) {
    grid = cycle(grid);
    // console.log(i, countGrid(grid));
    const key = grid.join("\n");
    if (PREV.has(key)) {
      const pi = PREV_LIST.indexOf(key);
      const l = i - pi;
      rem = (CYCLES - pi) % l;
      // console.log("loop detected", { pi, i, l, rem });
      break;
    }
    PREV.add(key);
    PREV_LIST.push(key);
  }

  for (let i = 0; i < rem; i++) {
    grid = cycle(grid);
    // console.log(countGrid(grid));
  }

  // printGrid(rotateCW(grid));
  return countGrid(grid);
};

const printGrid = (g: string[]) => {
  console.log("-----------");
  console.log(g.join("\n"));
  console.log("-----------");
};

const task = new Task(2023, 14, part1, part2, {
  part1: {
    input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
    result: "136",
  },
  part2: {
    input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
    result: "64",
  },
});

export default task;

// 94566 - low
// 94592 - high
