import Task, { TaskPartSolution } from "../utils/task.js";

type Pos = [number, number];
type Path = Pos[];

const neighbors = (x: number, y: number): Pos[] => [
  [x - 1, y],
  [x + 1, y],
  [x, y - 1],
  [x, y + 1],
];

const findPaths = (path: Path, map: number[][]): Path[] => {
  const node = path[path.length - 1];
  const c = map[node[1]][node[0]];
  if (c === 9) return [path];
  let res: Path[] = [];
  for (let n of neighbors(node[0], node[1])) {
    const [x, y] = n;
    if (map[y]?.[x] === c + 1) {
      res = [...res, ...findPaths([...path, [x, y]], map)];
    }
  }
  return res;
};
const countPaths = (paths: Path[]): number => {
  return new Set(paths.map((path) => path[path.length - 1].join(","))).size;
};
const part1: TaskPartSolution = (input) => {
  const map = input.split("\n").map((line) => line.split("").map(Number));
  let res = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) {
        const p = findPaths([[x, y]], map);
        // console.log({ x, y });
        const n = countPaths(p);
        // console.log({ x, y, n });

        res += n;
        // res += p;
      }
    }
  }
  return res;
};
const part2: TaskPartSolution = (input) => {
  const map = input.split("\n").map((line) => line.split("").map(Number));
  let res = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) {
        const p = findPaths([[x, y]], map);
        // console.log({ x, y });
        const n = countPaths(p);
        // console.log({ x, y, n });

        res += p.length;
        // res += p;
      }
    }
  }
  return res;
};

const task = new Task(2024, 10, part1, part2, {
  part1: {
    input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
    result: "36",
  },
  part2: {
    input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
    result: "81",
  },
});

export default task;
