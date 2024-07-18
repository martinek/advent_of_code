import { COLOR, SUM, isPresent, mod } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";
import readline from "readline";

type Map = boolean[][]; // true - wall, false - empty
type Pos = [number, number]; // [x, y]

const parseInput = (input: string): [Map, Pos] => {
  let pos: Pos;

  const map = input.split("\n").map((r, y) =>
    r.split("").map((c, x) => {
      if (c === "S") {
        pos = [x, y];
      }
      return c === "#";
    })
  );

  return [map, pos!];
};

const N = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const neighbors = (p: Pos): Pos[] => N.map((d) => [p[0] + d[0], p[1] + d[1]]);

const step = (positions: Pos[], map: Map): Pos[] => {
  const width = map[0].length;
  const height = map.length;
  const posMap: Map = new Array(height).fill(1).map(() => new Array(width).fill(1).map(() => false));
  positions
    .flatMap((p) => neighbors(p).filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height))
    .forEach((p) => (posMap[p[1]][p[0]] = true));
  return posMap
    .flatMap((row, y) => row.map((v, x): Pos | null => (v === true && map[y][x] === false ? [x, y] : null)))
    .filter(isPresent);
};

const part1: TaskPartSolution = (input) => {
  const [map, start] = parseInput(input);
  let positions = [start];
  for (let i = 0; i < 64; i++) {
    positions = step(positions, map);
    console.log(i, positions.length);
  }
  return positions.length;
};

type PositionsMap = Record<string, Record<string, boolean>>;
type Chunks = Record<string, { x: number; y: number; positions: PositionsMap }>;
const CHUNK_CACHE: Record<string, Pos[]> = {};

const printMap = (map: Map, positions: Pos[]) => {
  const posMap: { [y: number]: { [x: number]: boolean } } = {};
  positions
    .flatMap((p) => neighbors(p))
    .forEach(([px, py]) => {
      if (!posMap[py]) posMap[py] = {};
      posMap[py][px] = true;
    });

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const c = map[y][x];
      process.stdout.write(c ? `${COLOR.Reset}#` : `${posMap[y]?.[x] ? COLOR.BgGreen : COLOR.Reset}.`);
    }
    process.stdout.write(`${COLOR.Reset}\n`);
  }
};

function prompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question("Continue?", (ans) => {
      rl.close();
      if (ans === "n") process.exit(0);
      resolve(ans);
    })
  );
}

const stepChunk = async (positions: Pos[], map: Map, debug?: boolean): Promise<Pos[]> => {
  if (debug) {
    // console.log(getBounds(positions));
    // console.log(positions);
    printMap(map, positions);
    await prompt();
  }

  const chunkKey = positions.map((p) => `${p[0]}_${p[1]}`).join("|");
  if (CHUNK_CACHE[chunkKey]) return CHUNK_CACHE[chunkKey];

  const width = map[0].length;
  const height = map.length;
  const posMap: { [y: number]: { [x: number]: boolean } } = {};
  positions
    .flatMap((p) => neighbors(p))
    .forEach(([px, py]) => {
      if (!posMap[py]) posMap[py] = {};
      posMap[py][px] = true;
    });

  const res = Object.entries(posMap)
    .flatMap(([ys, row]) =>
      Object.entries(row).map(([xs, v]): Pos | null => {
        const x = Number(xs);
        const y = Number(ys);
        if (v === true && map[mod(y, height)][mod(x, width)] === false) {
          return [x, y];
        }
        return null;
      })
    )
    .filter(isPresent);

  CHUNK_CACHE[chunkKey] = res;
  return res;
};

const getBounds = (positions: Pos[]) => {
  return [
    [Math.min(...positions.map((p) => p[0])), Math.min(...positions.map((p) => p[1]))],
    [Math.max(...positions.map((p) => p[0])), Math.max(...positions.map((p) => p[1]))],
  ] as const;
};

const posChunk = (pos: Pos, width: number, height: number): Pos => {
  return [pos[0] - mod(pos[0], width), pos[1] - mod(pos[1], height)];
};

const step1 = async (chunks: Chunks, map: Map): Promise<Chunks> => {
  const width = map[0].length;
  const height = map.length;

  Object.entries(chunks).forEach((chunk) => {});

  // console.log(bounds);

  // console.log("step1");

  // align x and y with chunks
  for (let x = bounds[0][0] - mod(bounds[0][0], width); x <= bounds[1][0]; x += width) {
    for (let y = bounds[0][1] - mod(bounds[0][1], height); y <= bounds[1][1]; y += height) {
      const chunkMin = [x - 1, y - 1];
      const chunkMax = [x + width, y + width];
      // console.log(`chunk[${x},${y}]`, chunkMin, chunkMax);
      const chunkPos = positions
        .filter(([px, py]) => px >= chunkMin[0] && px <= chunkMax[0] && py >= chunkMin[1] && py <= chunkMax[1])
        .map(([px, py]): Pos => [px - x, py - y]);

      if (chunkPos.length === 0) {
        continue;
      }

      (await stepChunk(chunkPos, map))
        .map(([px, py]) => [px + x, py + y])
        .forEach(([px, py]) => {
          if (!posMap[py]) posMap[py] = {};
          posMap[py][px] = true;
        });
    }
  }

  return Object.entries(posMap)
    .flatMap(([ys, row]) =>
      Object.entries(row).map(([xs, v]): Pos | null => {
        const x = Number(xs);
        const y = Number(ys);
        return v === true && map[mod(y, height)][mod(x, width)] === false ? [x, y] : null;
      })
    )
    .filter(isPresent);
};

const getSum = (chunks: Chunks): number => {
  return SUM(Object.values(chunks).map((c) => SUM(Object.entries(c.positions).map((r) => Object.values(r[1]).length))));
};

const part2: TaskPartSolution = async (input) => {
  const [map, start] = parseInput(input);
  let chunks: Chunks = { "0_0": { x: 0, y: 0, positions: { [start[1]]: { [start[0]]: true } } } };
  for (let i = 0; i < 26501365; i++) {
    // for (let i = 0; i < 10; i++) {
    chunks = await step1(chunks, map);
    if ([6, 10, 50, 100, 500, 1000, 5000].includes(i + 1) || i % 100 === 0) {
      console.log(i + 1, getSum(chunks));
    }
  }
  return getSum(chunks);
};

const task = new Task(2023, 21, part1, part2, {
  part1: {
    input: `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
    result: "16",
  },
  part2: {
    input: `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
    result: "???",
  },
});

export default task;
