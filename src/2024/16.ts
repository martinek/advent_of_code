import { pause } from "../utils/helpers.js";
import { COLOR_LIBRARY, ill } from "../utils/illustrator.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Direction = "up" | "down" | "left" | "right";
const DIRECTIONS: Direction[] = ["up", "right", "down", "left"];
type Point = { x: number; y: number };

interface State {
  map: string[][];
  start: Point;
  end: Point;
  heading: Direction;
}
const parseInput = (input: string): State => {
  let start: Point = { x: 0, y: 0 };
  let end: Point = { x: 0, y: 0 };
  const map: string[][] = input.split("\n").map((line, y) =>
    line.split("").map((char, x) => {
      if (char === "S") {
        start.x = x;
        start.y = y;
        return ".";
      } else if (char === "E") {
        end.x = x;
        end.y = y;
        return ".";
      }
      return char;
    })
  );

  return {
    map,
    start,
    end,
    heading: "right",
  };
};

interface PathStep {
  point: Point;
  heading: Direction;
  cost: number;
}

type Path = {
  points: PathStep[];
  cost: number;
  q: number;
};
const OFFSETS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const turnCost = (from: Direction, to: Direction): number => {
  if (from === to) return 1;
  const fromIndex = DIRECTIONS.indexOf(from) + DIRECTIONS.length;
  const toIndex = DIRECTIONS.indexOf(to) + DIRECTIONS.length;
  const diff = Math.abs(fromIndex - toIndex);
  if (diff === 1 || diff === 3) return 1001;
  return Infinity;
};

const neighbors = (pt: PathStep, map: string[][]): PathStep[] => {
  const n: PathStep[] = [];
  for (const d of DIRECTIONS) {
    const [dx, dy] = OFFSETS[d];
    const x = pt.point.x + dx;
    const y = pt.point.y + dy;
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
      continue;
    }
    if (map[y][x] === "#") continue;
    const c = turnCost(pt.heading, d);
    if (c === Infinity) continue; // Do not turn around
    n.push({ point: { x, y }, heading: d, cost: pt.cost + c });
  }
  return n;
};

const heur = (last: Point, target: Point): number => {
  return Math.abs(target.x - last.x) + Math.abs(target.y - last.y);
};

const findPath = (state: State): Path[] => {
  let minCost = Infinity;
  const key = (point: Point, heading: Direction) => `${point.x},${point.y},${heading}`;
  const visited: { [key: string]: number } = {};
  const foundPaths: Path[] = [];
  const pendingPaths: Path[] = [
    { points: [{ point: state.start, heading: state.heading, cost: 0 }], cost: 0, q: heur(state.start, state.end) },
  ];
  let i = 0;
  while (pendingPaths.length > 0) {
    i++;
    const path = pendingPaths.sort((a, b) => b.q - a.q).pop()!;
    const lastStep = path.points[path.points.length - 1];
    const nextSteps = neighbors(lastStep, state.map);
    if (nextSteps.length === 0) {
      // printPath(path, state.map);
      // console.log(path);
      // pause();
      continue;
    }
    for (const nextStep of nextSteps) {
      if (nextStep.cost > minCost) continue; // no need to go further
      const k = key(nextStep.point, nextStep.heading);
      if (visited[k] < nextStep.cost) continue; // been there, done that
      visited[k] = nextStep.cost;
      const newPath = { points: [...path.points, nextStep], cost: nextStep.cost, q: heur(nextStep.point, state.end) };
      if (nextStep.point.x === state.end.x && nextStep.point.y === state.end.y) {
        if (newPath.cost < minCost) {
          minCost = newPath.cost;
        }
        foundPaths.push(newPath);
        // printPath(path, state.map);
        // console.log("Found path", newPath.cost);
        continue;
      }
      pendingPaths.push(newPath);
    }
    // if (i % 100000 === 0) {
    //   console.log("Pending paths", pendingPaths.length);
    //   console.log("Found paths", foundPaths.length);
    //   console.log("Last cost", path.cost);
    //   console.log("Min cost", minCost);
    //   printPath(path, state.map);
    // }
  }
  return foundPaths;
};

ill.PPC = 2;
const cMap = {
  ".": COLOR_LIBRARY[0],
  "#": [80, 80, 80, 255],
  U: COLOR_LIBRARY[1],
  D: COLOR_LIBRARY[1],
  L: COLOR_LIBRARY[1],
  R: COLOR_LIBRARY[1],
} as const;
ill.startRecording("2024_16");

const printPath = (path: Path, map: string[][]) => {
  // console.log("Path:");
  // console.log(path.points.map((p) => `${p.point.x},${p.point.y} ${p.heading} ${p.cost}`).join("\n"));
  let str = "";
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const p = path.points.find((pt) => pt.point.x === x && pt.point.y === y);
      if (p != null) {
        str += p.heading[0].toUpperCase();
      } else {
        str += map[y][x];
      }
    }
    str += "\n";
  }
  ill.log(str, cMap);
};

const part1: TaskPartSolution = (input) => {
  const state = parseInput(input);
  const paths = findPath(state);
  return Math.min(...paths.map((p) => p.points[p.points.length - 1].cost));
};

const part2: TaskPartSolution = (input) => {
  const state = parseInput(input);
  const paths = findPath(state);
  const tiles = new Set<string>();
  const min = Math.min(...paths.map((p) => p.points[p.points.length - 1].cost));
  const minPaths = paths.filter((p) => p.cost === min);
  // minPaths.forEach((p) => {
  //   console.log(p.cost);
  //   printPath(p, state.map);
  // });
  minPaths.forEach((p) => p.points.forEach((pt) => tiles.add(`${pt.point.x},${pt.point.y}`)));
  return tiles.size;
};

const task = new Task(2024, 16, part1, part2, {
  part1: {
    input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
    result: "7036",
  },
  part2: {
    input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
    result: "45",
  },
});

export default task;

// 215680 - high
// 205672 - high
