import { SUM, isPresent } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Char = "." | "#";
type Universe = Char[][];

const parseUniverse = (input: string): Universe => {
  return input.split("\n").map((row) => row.split("") as Char[]);
};

const getEmpties = (universe: Universe): { emptyRows: Set<number>; emptyCols: Set<number> } => {
  const emptyRows = new Set<number>(
    universe.map((r, i) => (r.every((n) => n === ".") ? i : undefined)).filter(isPresent)
  );
  const emptyCols = new Set<number>();
  for (let i = 0; i < universe[0].length; i++) {
    const col = universe.map((r) => r[i]);
    if (col.every((n) => n === ".")) {
      emptyCols.add(i);
    }
  }
  return { emptyRows, emptyCols };
};

const expandUniverse = (universe: Universe) => {
  const { emptyCols, emptyRows } = getEmpties(universe);
  const newUniverse: Universe = [];
  universe.forEach((r, i) => {
    const newR: Char[] = [];
    r.forEach((n, i) => {
      newR.push(n);
      if (emptyCols.has(i)) {
        newR.push(".");
      }
    });
    newUniverse.push(newR);
    if (emptyRows.has(i)) {
      newUniverse.push([...newR]);
    }
  });
  return newUniverse;
};

interface Pos {
  x: number;
  y: number;
}
const dist = (a: Pos, b: Pos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const solve1 = (universe: Universe) => {
  const gals: Pos[] = [];
  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[y].length; x++) {
      if (universe[y][x] === "#") {
        gals.push({ x, y });
      }
    }
  }

  const lengths: number[] = [];
  for (const g of gals) {
    for (const h of gals) {
      lengths.push(dist(g, h));
    }
  }
  return SUM(lengths) / 2;
};

const part1: TaskPartSolution = (input) => {
  const universe = parseUniverse(input);
  // const expanded = expandUniverse(universe);
  return solve2(universe, 2);
};

const dist2 = (a: Pos, b: Pos, emptyCols: Set<number>, emptyRows: Set<number>, m: number): number => {
  const ec = Array.from(emptyCols);
  const er = Array.from(emptyRows);
  const minx = Math.min(a.x, b.x);
  const maxx = Math.max(a.x, b.x);
  const miny = Math.min(a.y, b.y);
  const maxy = Math.max(a.y, b.y);
  const emptyx = ec.filter((n) => n > minx && n < maxx).length;
  const emptyy = er.filter((n) => n > miny && n < maxy).length;
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  const res = dx - emptyx + (dy - emptyy) + emptyx * m + emptyy * m;
  // console.log({ m, a, b, minx, maxx, miny, maxy, ec, er, emptyx, emptyy, dx, dy, res });
  return res;
};

const solve2 = (universe: Universe, m: number): number => {
  const { emptyCols, emptyRows } = getEmpties(universe);
  const gals: Pos[] = [];
  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[y].length; x++) {
      if (universe[y][x] === "#") {
        gals.push({ x, y });
      }
    }
  }

  const lengths: number[] = [];
  for (const g of gals) {
    for (const h of gals) {
      lengths.push(dist2(g, h, emptyCols, emptyRows, m));
    }
  }
  return SUM(lengths) / 2;
};

const part2: TaskPartSolution = (input) => {
  const universe = parseUniverse(input);
  // const expanded = expandUniverse(universe);
  return solve2(universe, 1_000_000);
};

const task = new Task(2023, 11, part1, part2, {
  part1: {
    input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
    result: "374",
  },
  part2: {
    input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
    result: "1030",
  },
});

export default task;

// X: 159730917863
// start ~6:02, end: 6:44
