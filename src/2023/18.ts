import { COLOR } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Direction = "R" | "D" | "L" | "U";
type Command = { direction: Direction; distance: number };
const parseInput = (input: string): Command[] => {
  return input.split("\n").map((r) => {
    const [d, n, _c] = r.split(" ");
    const cmd: Command = {
      direction: d as Direction,
      distance: Number(n),
    };
    return cmd;
  });
};
const parseInput1 = (input: string): Command[] => {
  return input.split("\n").map((r) => {
    const [_1, _2, c] = r.split(" ");
    const distance = parseInt(c.slice(2, -2), 16);
    const direction = "RDLU"[Number(c[7])] as Direction;
    const cmd: Command = {
      direction,
      distance,
    };
    return cmd;
  });
};

type Pos = [number, number];

const DIFF: Record<Direction, [number, number]> = {
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
};
const posKey = (pos: Pos): string => `${pos[0]}_${pos[1]}`;

const getArea = (commands: Command[]): number => {
  // const map: Record<string, string | undefined> = {};
  const bounds = {
    x: { min: 0, max: 0 },
    y: { min: 0, max: 0 },
  };
  let current: Pos = [0, 0];
  const map: boolean[][] = [[false]];
  commands.forEach((cmd) => {
    const d = DIFF[cmd.direction];
    for (let i = 1; i <= cmd.distance; i++) {
      current = [current[0] + d[0], current[1] + d[1]];
      bounds.x.min = Math.min(bounds.x.min, current[0]);
      bounds.x.max = Math.max(bounds.x.max, current[0]);
      bounds.y.min = Math.min(bounds.y.min, current[1]);
      bounds.y.max = Math.max(bounds.y.max, current[1]);
      if (map[current[1]] == null) {
        map[current[1]] = [];
      }
      map[current[1]][current[0]] = true;
    }
  });

  // for (let y = bounds.y.min; y <= bounds.y.max; y++) {
  //   for (let x = bounds.x.min; x <= bounds.x.max; x++) {
  //     const thisCell = map[posKey([x, y])] != null;
  //     process.stdout.write(`${thisCell ? "#" : "."}`);
  //   }
  //   process.stdout.write("\n");
  // }

  // const filled: Record<string, boolean> = {};

  console.log({ bounds });
  let n = 0;

  for (let y = bounds.y.min; y <= bounds.y.max; y++) {
    let isIn = false;
    for (let x = bounds.x.min; x <= bounds.x.max; x++) {
      let thisCell = false;
      // let color = COLOR.Reset;

      if (map[y]?.[x]) {
        if (map[y - 1]?.[x] && map[y + 1]?.[x]) {
          isIn = !isIn;
          // color = COLOR.BgGreen;
        } else if (map[y - 1]?.[x] && !map[y + 1]?.[x]) {
          isIn = !isIn;
          // color = COLOR.BgRed;
        }
      }
      // const edge =

      // if (isIn) {
      //   if (map[posKey([x, y])] == null && map[posKey([x - 1, y])] != null && map[posKey([x - 1, y + 1])] != null) {
      //     isIn = !isIn;
      //     color = COLOR.FgGreen;
      //   }
      // } else {
      //   if (map[posKey([x, y])] != null && map[posKey([x + 1, y])] == null && map[posKey([x, y + 1])] != null) {
      //     isIn = !isIn;
      //     color = COLOR.FgRed;
      //   }
      // }

      thisCell = isIn || map[y][x];

      // if (map[k] != null) {
      //   color = COLOR.FgGreen;
      //   thisCell = true;
      //   if (map[nextK] == null && isVert) {
      //     color = COLOR.FgRed;
      //     isIn = !isIn;
      //   }
      // } else {
      //   color = isIn ? COLOR.FgCyan : COLOR.FgMagenta;
      //   thisCell = isIn;
      // }
      // filled[k] = thisCell;
      if (thisCell) {
        n += 1;
      }
      // process.stdout.write(`${color}${thisCell ? "#" : "."}`);
      // filled[k] = isIn;
      // if (x % 10000 == 0) {
      //   console.log(x);
      // }
    }
    // process.stdout.write("\n");
    if (y % 100 == 0) {
      console.log(y);
    }
  }

  // return Object.values(filled).filter((v) => v === true).length;
  return n;
};

const part1: TaskPartSolution = (input) => {
  const cmds = parseInput(input);
  return getArea(cmds);
};
const part2: TaskPartSolution = (input) => {
  const cmds = parseInput1(input);
  // console.log(cmds);
  console.log(cmds.length);
  // return getArea(cmds2);
};

const task = new Task(2023, 18, part1, part2, {
  part1: {
    input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
    result: "62",
  },
  part2: {
    input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
    result: "952408144115",
  },
});

export default task;

// 49297 low
