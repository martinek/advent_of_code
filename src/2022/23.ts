import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

type Tile = "#" | ".";
// type Groove = Tile[][];
type Groove = {
  [key: string]: boolean | undefined;
};
type Direction = "N" | "E" | "S" | "W";
type Position = [number, number];

const posToString = (pos: Position): string => `${pos[0]}_${pos[1]}`;
const stringToPos = (str: string): Position => str.split("_").map(Number) as Position;

const DIRECTIONS: Direction[] = ["N", "S", "W", "E"];

const parseInput = (i: string): Groove => {
  const groove: Groove = {};
  i.split("\n").forEach((row, y) =>
    row.split("").forEach((c, x) => {
      if (c === "#") {
        groove[posToString([x, y])] = true;
      }
    })
  );
  return groove;
};

const isAlone = (groove: Groove, pos: Position): boolean => {
  return (
    isEmpty(groove, pos, "N") && isEmpty(groove, pos, "E") && isEmpty(groove, pos, "S") && isEmpty(groove, pos, "W")
  );
};

const isEmpty = (groove: Groove, [x, y]: Position, direction: Direction): boolean => {
  const positions: Position[] = [];
  switch (direction) {
    case "N":
      positions.push([x - 1, y - 1], [x, y - 1], [x + 1, y - 1]);
      break;
    case "E":
      positions.push([x + 1, y - 1], [x + 1, y], [x + 1, y + 1]);
      break;
    case "S":
      positions.push([x - 1, y + 1], [x, y + 1], [x + 1, y + 1]);
      break;
    case "W":
      positions.push([x - 1, y - 1], [x - 1, y], [x - 1, y + 1]);
      break;
  }

  return positions.map(([x, y]) => groove[posToString([x, y])] !== true).reduce((acc, b) => acc && b, true);
};

const offset = ([x, y]: Position, direction: Direction): Position => {
  switch (direction) {
    case "N":
      return [x, y - 1];
    case "E":
      return [x + 1, y];
    case "S":
      return [x, y + 1];
    case "W":
      return [x - 1, y];
  }
};

const simulate = (groove: Groove, direction: Direction): Groove => {
  const directions: Direction[] = [];
  for (let i = 0; i < 4; i++) {
    directions.push(DIRECTIONS[(DIRECTIONS.indexOf(direction) + i) % DIRECTIONS.length]);
  }

  // get proposed directions
  const proposals: {
    [key: string]: string[];
  } = {};
  Object.keys(groove).forEach((key) => {
    const pos = stringToPos(key);
    if (isAlone(groove, pos)) return;
    const dir = directions.find((d) => isEmpty(groove, pos, d));
    if (dir == null) return;
    const dest = posToString(offset(pos, dir));
    proposals[dest] ||= [];
    proposals[dest].push(key);
  });

  if (Object.keys(proposals).length === 0) {
    console.log("NO MOVEMENT!");
    return groove;
  }

  const newGroove = { ...groove };
  for (const des in proposals) {
    if (proposals[des].length === 1) {
      const src = proposals[des][0];
      delete newGroove[src];
      newGroove[des] = true;
    }
  }

  return newGroove;
};

const getBounds = (g: Groove): { min: Position; max: Position; width: number; height: number } => {
  const [min, max] = Object.keys(g)
    .map(stringToPos)
    .reduce<[Position, Position]>(
      (acc, p) => [
        [Math.min(acc[0][0], p[0]), Math.min(acc[0][1], p[1])],
        [Math.max(acc[1][0], p[0]), Math.max(acc[1][1], p[1])],
      ],
      [
        [Number.MAX_VALUE, Number.MAX_VALUE],
        [Number.MIN_VALUE, Number.MIN_VALUE],
      ]
    );

  const width = max[0] - min[0] + 1;
  const height = max[1] - min[1] + 1;

  return { min, max, width, height };
};

const grooveToString = (g: Groove) => {
  const { min, width, height } = getBounds(g);

  let str = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      str += g[posToString([min[0] + x, min[1] + y])] === true ? "#" : ".";
    }
    str += "\n";
  }
  return str;
};

const getEmpty = (g: Groove) => {
  const { height, width } = getBounds(g);
  const size = width * height;
  console.log({ width, height, size, count: Object.keys(g).length });
  return size - Object.keys(g).length;
};

const part1: TaskPartSolution = (input) => {
  let groove = parseInput(input);
  // console.log(grooveToString(groove));

  for (let i = 0; i < 10; i++) {
    const direction = DIRECTIONS[i % DIRECTIONS.length];
    groove = simulate(groove, direction);
    // console.log(grooveToString(groove));
  }

  return getEmpty(groove);
};

const part2: TaskPartSolution = (input) => {
  let groove = parseInput(input);
  // console.log(grooveToString(groove));

  let i = 0;
  while (true) {
    const direction = DIRECTIONS[i % DIRECTIONS.length];
    const prevGroove = groove;
    groove = simulate(groove, direction);
    if (groove === prevGroove) {
      return i + 1;
    }
    i++;
  }
};

const task = new Task(2022, 23, part1, part2);

export default task;
