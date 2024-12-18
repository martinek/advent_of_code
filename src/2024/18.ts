import { ill } from "../utils/illustrator.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const parseInput = (input: string): Point[] => {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);
};

type Point = [number, number];

const findPath = (start: Point, end: Point, walls: string[][]) => {
  const visited = new Set<string>();
  const queue = [start];
  const path = new Map<string, Point>();
  while (queue.length) {
    const [x, y] = queue.shift()!;
    if (x === end[0] && y === end[1]) {
      break;
    }
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= walls[0].length || ny < 0 || ny >= walls.length) {
        continue;
      }
      if (walls[ny][nx] === "#" || visited.has(`${nx},${ny}`)) {
        continue;
      }
      visited.add(`${nx},${ny}`);
      queue.push([nx, ny]);
      path.set(`${nx},${ny}`, [x, y]);
    }
  }
  if (!path.has(`${end[0]},${end[1]}`)) {
    return null;
  }
  const pathPoints = [];
  let current = end;
  while (current[0] !== start[0] || current[1] !== start[1]) {
    pathPoints.push(current);
    current = path.get(`${current[0]},${current[1]}`)!;
  }
  pathPoints.push(start);
  pathPoints.reverse();
  return pathPoints;
};

ill.PPC = 50;

const part1: TaskPartSolution = (input) => {
  const points = parseInput(input);
  // const size = 7; // test
  // const steps = 12; // test
  const size = 71; // task
  const steps = 1024; // task
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill("."));
  points.slice(0, steps).forEach(([x, y], i) => {
    grid[y][x] = "#";
  });

  const start: Point = [0, 0];
  const end: Point = [size - 1, size - 1];
  const path = findPath(start, end, grid);

  if (!path) throw new Error("No path found");

  return path.length - 1;
};
const part2: TaskPartSolution = (input) => {
  const points = parseInput(input);
  // const size = 7; // test
  // const steps = 12; // test
  const size = 71; // task
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill("."));

  const start: Point = [0, 0];
  const end: Point = [size - 1, size - 1];

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    grid[pt[1]][pt[0]] = "#";
    const path = findPath(start, end, grid);
    if (path === null) {
      return `${pt[0]},${pt[1]}`;
    }
  }

  throw new Error("No solution found");
};

const task = new Task(2024, 18, part1, part2, {
  part1: {
    input: `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`,
    result: "22",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
