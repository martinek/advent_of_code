import Task, { TaskPartSolution } from "../utils/task.js";

interface Input {
  width: number;
  height: number;
  walls: Set<string>;
  start: string;
  end: string;
}

const N = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
] as const;

const parseInput = (input: string): Input => {
  const res: Input = {
    walls: new Set<string>(),
    start: "",
    end: "",
    width: 0,
    height: 0,
  };
  const lines = input.split("\n").map((x) => x.trim());
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === "#") {
        res.walls.add(`${x},${y}`);
      }
      if (lines[y][x] === "S") res.start = `${x},${y}`;
      if (lines[y][x] === "E") res.end = `${x},${y}`;

      res.width = Math.max(res.width, x + 1);
    }
    res.height = Math.max(res.height, y + 1);
  }
  return res;
};

const findRoute = (input: Input): string[] => {
  const path: string[] = [];
  const { start, end, walls, width, height } = input;
  const queue = [{ pt: start, steps: 0 }];
  const visited = new Map<string, { from: string; steps: number }>();
  visited.set(start, { from: "", steps: 0 });
  while (queue.length > 0) {
    const { pt, steps } = queue.shift()!;
    if (pt === end) {
      // collect path and return it
      let p = pt;
      while (p !== start) {
        path.push(p);
        p = visited.get(p)!.from;
      }
      path.push(start);
      return path;
    }

    for (const [dx, dy] of N) {
      const [x, y] = pt.split(",").map(Number);
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const npt = `${nx},${ny}`;
      if (walls.has(npt)) continue;
      if (visited.has(npt)) continue;
      visited.set(npt, { from: pt, steps: steps + 1 });
      queue.push({ pt: npt, steps: steps + 1 });
    }
  }
  return path;
};

const dist = (a: string, b: string) => {
  const [ax, ay] = a.split(",").map(Number);
  const [bx, by] = b.split(",").map(Number);
  return Math.abs(ax - bx) + Math.abs(ay - by);
};

const cheatReachablePoints = (input: Input, point: string, distance: number) => {
  const [x, y] = point.split(",").map(Number);
  const res = new Set<string>();
  for (let dx = -distance; dx <= distance; dx++) {
    if (x + dx < 0 || x + dx >= input.width) continue;
    for (let dy = -distance; dy <= distance; dy++) {
      if (y + dy < 0 || y + dy >= input.height) continue;
      if (Math.abs(dx) + Math.abs(dy) <= distance) {
        const pt = `${x + dx},${y + dy}`;
        if (input.walls.has(pt)) continue;
        res.add(`${x + dx},${y + dy}`);
      }
    }
  }
  return res;
};

const part1: TaskPartSolution = (input) => {
  const i = parseInput(input);
  const route = findRoute(i);
  const distances = new Map<string, number>();
  route.forEach((pt, idx) => {
    distances.set(pt, idx);
  });

  let r = 0;
  route.forEach((a) => {
    const pts = cheatReachablePoints(i, a, 2);
    const d1 = distances.get(a)!;
    pts.forEach((b) => {
      const d2 = distances.get(b)!;
      const gain = d1 - d2 - dist(a, b);
      if (gain >= 100) {
        r++;
      }
    });
  });

  return r;
};
const part2: TaskPartSolution = (input) => {
  const i = parseInput(input);
  const route = findRoute(i);
  const distances = new Map<string, number>();
  route.forEach((pt, idx) => {
    distances.set(pt, idx);
  });

  let r = 0;
  route.forEach((a) => {
    const pts = cheatReachablePoints(i, a, 20);
    const d1 = distances.get(a)!;
    pts.forEach((b) => {
      const d2 = distances.get(b)!;
      const gain = d1 - d2 - dist(a, b);
      if (gain >= 100) {
        r++;
      }
    });
  });

  return r;
};

const task = new Task(2024, 20, part1, part2, {
  part1: {
    input: `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
    result: "44",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;

// 6968 - high
