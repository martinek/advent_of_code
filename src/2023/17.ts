import Task, { TaskPartSolution } from "../utils/task.js";

type Direction = "e" | "s" | "w" | "n";
type BlockCache = { [direction: string]: { [straight: number]: number | undefined } | undefined };
type BlockNeighbor = { block: Block; cost: number; dir: Direction };
type BlockNeighbors = {
  n: BlockNeighbor[];
  e: BlockNeighbor[];
  s: BlockNeighbor[];
  w: BlockNeighbor[];
};
type Block = {
  x: number;
  y: number;
  loss: number;
  bestVisitedLoss: BlockCache;
  dist: number;
  neighbors: BlockNeighbors;
  n?: Block;
  e?: Block;
  s?: Block;
  w?: Block;
};
type City = Block[][];

const parseCity = (input: string, minLen: number, maxLen: number): City => {
  const chars = input.split("\n").map((r) => r.split(""));
  const width = chars[0].length;
  const height = chars.length;
  const city: City = chars.map((row, y) =>
    row.map((c, x) => ({
      x,
      y,
      loss: Number(c),
      bestVisitedLoss: {},
      dist: width - x + (height - y),
      neighbors: { n: [], e: [], s: [], w: [] },
    }))
  );

  city.forEach((row, y) => {
    row.forEach((block, x) => {
      let cost = 0;
      // east
      for (let i = 1; i <= maxLen; i++) {
        const n = city[y][x + i];
        if (n) {
          cost += n.loss;
          if (i >= minLen) {
            block.neighbors.e.push({ block: n, cost, dir: "e" });
          }
        }
      }
      // west
      cost = 0;
      for (let i = 1; i <= maxLen; i++) {
        const n = city[y][x - i];
        if (n) {
          cost += n.loss;
          if (i >= minLen) {
            block.neighbors.w.push({ block: n, cost, dir: "w" });
          }
        }
      }
      // north
      cost = 0;
      for (let i = 1; i <= maxLen; i++) {
        const n = city[y - i]?.[x];
        if (n) {
          cost += n.loss;
          if (i >= minLen) {
            block.neighbors.n.push({ block: n, cost, dir: "n" });
          }
        }
      }
      // south
      cost = 0;
      for (let i = 1; i <= maxLen; i++) {
        const n = city[y + i]?.[x];
        if (n) {
          cost += n.loss;
          if (i >= minLen) {
            block.neighbors.s.push({ block: n, cost, dir: "s" });
          }
        }
      }
    });
  });

  return city;
};

type Path = {
  loss: number;
  path: Block[];
  lastDir?: Direction;
  straight: number;
  current: Block;
};

const DIRECTIONS: Direction[] = ["e", "s", "w", "n"];

const isReverseDir = (d: Direction, prevDir?: Direction): boolean => {
  switch (prevDir) {
    case "e":
      return d === "w";
    case "s":
      return d === "n";
    case "w":
      return d === "e";
    case "n":
      return d === "s";
  }
  return false;
};

const blockKey = (b: Block, dir: Direction) => `${b.y}_${b.x}_${dir === "e" || dir === "w" ? "h" : "v"}`;

const findPath1 = (city: City): Path | undefined => {
  const CACHE: { [blockKey: string]: number | undefined } = {
    "0_0_h": 0,
    "0_0_v": 0,
  };

  const start = city[0][0];
  const end = city[city.length - 1][city[0].length - 1];

  // let minPath = 1071;
  let minPath = Infinity;
  let activePaths: Path[] = [{ current: start, loss: 0, path: [], straight: 0 }];
  let foundPath: Path | undefined;

  let i = 0;

  while (activePaths.length > 0) {
    const p = activePaths.shift()!;

    const candidates = DIRECTIONS.flatMap((d) => {
      // do not go in same direction
      if (d === p.lastDir) return [];
      // do not go back
      if (isReverseDir(d, p.lastDir)) return [];
      return p.current.neighbors[d];
    });

    candidates.forEach(({ block, cost, dir }) => {
      const np: Path = { current: block, loss: p.loss + cost, straight: 0, lastDir: dir, path: [...p.path, block] };
      const key = blockKey(block, dir);

      // ignore paths with suboptimal cost
      if (np.loss >= minPath) return;
      if (np.loss >= (CACHE[key] ?? Infinity)) return;

      CACHE[key] = np.loss;

      if (np.current === end) {
        minPath = np.loss;
        foundPath = np;
        // console.log("found p", minPath);
      } else {
        const i = activePaths.findIndex((p) => {
          return p.current.dist >= np.current.dist;
        });
        activePaths.splice(i, 0, np);
      }
    });

    i++;

    // if (i % 100000 == 0) {
    //   console.log(`LOOP ${i}: ${activePaths.length}`);
    // }
  }

  // let prevNode = start;
  // console.log(prevNode.y, prevNode.x);
  // foundPath?.path.forEach((n) => {
  //   const connection = Object.values(prevNode.neighbors)
  //     .flat()
  //     .find((c) => c.block === n);
  //   console.log(connection?.dir, connection?.cost, " => ", n.y, n.x);
  //   prevNode = n;
  // });

  return foundPath;
};

const printPath = (path: Path) => {
  const prevNode = path.path.forEach((n) => {});
};

const part1: TaskPartSolution = (input) => {
  const city = parseCity(input, 1, 3);
  const p = findPath1(city);

  return p?.loss;
};

const part2: TaskPartSolution = (input) => {
  const city = parseCity(input, 4, 10);
  const p = findPath1(city);

  return p?.loss;
};

const task = new Task(2023, 17, part1, part2, {
  part1: {
    input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
    result: "102",
  },
  part2: {
    input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
    result: "94",
  },
});

export default task;
