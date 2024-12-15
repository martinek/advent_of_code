import { ill } from "../utils/illustrator.js";
import Task, { TaskPartSolution } from "../utils/task.js";

interface Point {
  x: number;
  y: number;
}

type Direction = "<" | ">" | "^" | "v";

interface State {
  map: Point[]; // edges
  boxes: Point[]; // boxes
  robot: Point; // robot
  directions: Direction[];
}

const printState = (s: State, pt2 = false) => {
  const charMap = {
    "#": [0, 0, 255, 255],
    O: [0, 255, 0, 255],
    P: [0, 200, 0, 255],
    "@": [255, 255, 255, 255],
    ".": [40, 40, 40, 255],
  } as const;
  const { map, boxes, robot } = s;
  const maxX = Math.max(...map.map((p) => p.x), ...boxes.map((p) => p.x));
  const maxY = Math.max(...map.map((p) => p.y), ...boxes.map((p) => p.y));

  let res = "";
  for (let y = 0; y <= maxY; y++) {
    let row = "";
    for (let x = 0; x <= maxX; x++) {
      if (map.some((p) => p.x === x && p.y === y)) {
        row += "#";
      } else if (boxes.some((p) => p.x === x && p.y === y)) {
        row += "O";
      } else if (boxes.some((p) => p.x === x - 1 && p.y === y)) {
        row += "P";
      } else if (robot.x === x && robot.y === y) {
        row += "@";
      } else if (robot.x === x - 1 && robot.y === y) {
        row += ".";
      } else {
        row += ".";
      }
    }
    res += row + "\n";
  }
  ill.GRID = 0;
  ill.PPC = 10;
  ill.log(res, charMap);
};

const parseInput = (input: string): State => {
  const [m, d] = input.split("\n\n");
  const s: State = {
    map: [],
    boxes: [],
    robot: { x: 0, y: 0 },
    directions: d
      .split("\n")
      .map((l) => l.trim())
      .join("")
      .split("")
      .map((d) => d as Direction),
  };

  m.split("\n").forEach((row, y) => {
    row
      .trim()
      .split("")
      .forEach((cell, x) => {
        if (cell === "#") {
          s.map.push({ x, y });
        } else if (cell === "O") {
          s.boxes.push({ x, y });
        } else if (cell === "@") {
          s.robot = { x, y };
        }
      });
  });

  return s;
};

const parseInput2 = (input: string): State => {
  const [m, d] = input.split("\n\n");
  const s: State = {
    map: [],
    boxes: [],
    robot: { x: 0, y: 0 },
    directions: d
      .split("\n")
      .map((l) => l.trim())
      .join("")
      .split("")
      .map((d) => d as Direction),
  };

  m.split("\n").forEach((row, y) => {
    row
      .trim()
      .split("")
      .forEach((cell, x) => {
        if (cell === "#") {
          s.map.push({ x: x * 2, y });
          s.map.push({ x: x * 2 + 1, y });
        } else if (cell === "O") {
          s.boxes.push({ x: x * 2, y });
        } else if (cell === "@") {
          s.robot = { x: x * 2, y };
        }
      });
  });

  return s;
};

const movePoint = (p: Point, d: Direction): Point => {
  switch (d) {
    case "^":
      return { x: p.x, y: p.y - 1 };
    case ">":
      return { x: p.x + 1, y: p.y };
    case "v":
      return { x: p.x, y: p.y + 1 };
    case "<":
      return { x: p.x - 1, y: p.y };
  }
};

const step = (s: State, d: Direction): State => {
  const { robot, map, boxes } = s;

  const next = movePoint(robot, d); // next point for robot
  // console.log("NEXT", next);

  // if next point is wall, do not move
  if (map.some((p) => p.x === next.x && p.y === next.y)) {
    return s;
  }

  // if next point is box
  const box = boxes.find((b) => b.x === next.x && b.y === next.y);
  if (box) {
    const n: "x" | "y" = d === "^" || d === "v" ? "x" : "y"; // same coordinate
    const m: "x" | "y" = d === "^" || d === "v" ? "y" : "x"; // different coordinate
    const l: -1 | 1 = d === "^" || d === "<" ? -1 : 1;
    // find all boxes in row
    // console.log(n, m, robot[n]);
    const lineBoxes = boxes.filter((b) => {
      return b[n] === robot[n];
    });
    // indexes of all boxes in the line that are in the same direction as the robot
    const aBoxes = lineBoxes.filter((b) => (l < 0 ? b[m] < robot[m] : b[m] > robot[m]));
    const aBoxesIndexes = aBoxes.map((b) => b[m]).sort((a, b) => (l < 0 ? b - a : a - b));
    // console.log({ aBoxesIndexes });

    // indexes for first space in the line
    const indexes: number[] = [];
    for (let i = 0; i < aBoxesIndexes.length; i++) {
      if (i === 0 || aBoxesIndexes[i] === aBoxesIndexes[i - 1] + 1 * l) {
        indexes.push(aBoxesIndexes[i]);
      } else {
        break;
      }
    }

    // console.log({ indexes });

    // check if there is wall behind last box
    const lastBox: Point = { x: 0, y: 0, [n]: robot[n], [m]: indexes[indexes.length - 1] };
    const afterLastBox = movePoint(lastBox, d);
    // console.log("LAST", lastBox, afterLastBox);
    if (map.some((p) => p.x === afterLastBox.x && p.y === afterLastBox.y)) {
      // after boxes there is a wall, dont move
      return s;
    }

    // move first box in line to the end of line
    const firstBox = aBoxes.find((b) => b[m] === indexes[0]);
    firstBox![m] = afterLastBox[m];
    return { ...s, robot: next };
  }

  return { ...s, robot: next };
};

const collectBoxes = (boxes: Point[], pt: Point, width: number, direction: "^" | "v"): Point[] => {
  const nextBoxes = boxes.filter((b) => {
    return b.y === (direction === "^" ? pt.y - 1 : pt.y + 1) && b.x >= pt.x - 1 && b.x <= pt.x + width - 1;
  });

  return [...nextBoxes, ...nextBoxes.flatMap((b) => collectBoxes(boxes, b, 2, direction))];
};

const anyBlocked = (boxes: Point[], map: Point[], direction: "^" | "v"): boolean => {
  return boxes
    .flatMap((b) => [
      { x: b.x, y: b.y + (direction === "^" ? -1 : 1) },
      { x: b.x + 1, y: b.y + (direction === "^" ? -1 : 1) },
    ])
    .some((p) => map.some((m) => m.x === p.x && m.y === p.y));
};

const step2 = (s: State, d: Direction): State => {
  const { robot, map, boxes } = s;

  const next = movePoint(robot, d); // next point for robot
  // if next point is wall, do not move
  if (map.some((p) => p.x === next.x && p.y === next.y)) {
    return s;
  }

  // if next point is box
  const box = boxes.find((b) => (b.x === next.x || b.x + 1 === next.x) && b.y === next.y);
  if (box) {
    if (d === "^" || d === "v") {
      const boxesToMove = collectBoxes(boxes, robot, 1, d);
      // console.log(boxesToMove);
      if (anyBlocked(boxesToMove, map, d)) {
        // one of boxes is blocked, do not move
        return s;
      }
      // move all boxes by one (make sure each box is moved only once)
      new Set(boxesToMove).forEach((b) => {
        b.y = b.y + (d === "^" ? -1 : 1);
      });
      return { ...s, robot: next };
    } else {
      const l: boolean = d === "<";
      // find all boxes in row
      const lineBoxes = boxes.filter((b) => {
        return b.y === robot.y;
      });
      // indexes of all boxes in the line that are in the same direction as the robot
      const aBoxes = lineBoxes.filter((b) => (l ? b.x < robot.x : b.x > robot.x));
      const aBoxesIndexes = aBoxes.map((b) => b.x).sort((a, b) => (l ? b - a : a - b));
      // console.log({ aBoxes, aBoxesIndexes });

      // indexes until first space in the line
      const indexes: number[] = [];
      for (let i = 0; i < aBoxesIndexes.length; i++) {
        if (i === 0 || aBoxesIndexes[i] === aBoxesIndexes[i - 1] + 2 * (l ? -1 : 1)) {
          indexes.push(aBoxesIndexes[i]);
        } else {
          break;
        }
      }

      // console.log({ indexes });

      // check if there is wall behind last box
      const lastBox: Point = { x: indexes[indexes.length - 1], y: robot.y };
      const afterLastBox: Point = { ...lastBox, x: l ? lastBox.x - 1 : lastBox.x + 2 };
      // console.log("LAST", lastBox, afterLastBox);
      if (map.some((p) => p.x === afterLastBox.x && p.y === afterLastBox.y)) {
        // after boxes there is a wall, dont move
        return s;
      }

      // move all boxes by one
      indexes.forEach((bx) => {
        const box = boxes.find((b) => b.x === bx && b.y === robot.y)!;
        box.x = box.x + (l ? -1 : 1);
      });
      return { ...s, robot: next };
    }
  }

  return { ...s, robot: next };
};

const countState = (s: State): number => {
  return s.boxes.reduce((acc, b) => acc + b.x + b.y * 100, 0);
};

const part1: TaskPartSolution = (input) => {
  let s = parseInput(input);
  const directions = s.directions;

  for (const dir of directions) {
    s = step(s, dir);
    // printState(s);
    // pause();
  }

  // printState(s);

  return countState(s);
};
const part2: TaskPartSolution = (input) => {
  let s = parseInput2(input);
  const directions = s.directions;

  printState(s, true);

  let i = 0;
  for (const dir of directions) {
    i++;
    s = step2(s, dir);
    // console.log(i, dir);
    // printState(s);
    // pause();
  }
  // printState(s);

  return countState(s);
};

const task = new Task(2024, 15, part1, part2, {
  // part1: {
  //   input: `########
  // #..O.O.#
  // ##@.O..#
  // #...O..#
  // #.#.O..#
  // #...O..#
  // #......#
  // ########

  // <^^>>>vv<v>>v<<`,
  //   result: "2028",
  // },
  part1: {
    input: `##########
  #..O..O.O#
  #......O.#
  #.OO..O.O#
  #..O@..O.#
  #O#..O...#
  #O..O..O.#
  #.OO.O.OO#
  #....O...#
  ##########

  <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
  vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
  ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
  <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
  ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
  ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
  >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
  <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
  ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
  v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
    result: "10092",
  },
  part2: {
    input: `##########
  #..O..O.O#
  #......O.#
  #.OO..O.O#
  #..O@..O.#
  #O#..O...#
  #O..O..O.#
  #.OO.O.OO#
  #....O...#
  ##########

  <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
  vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
  ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
  <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
  ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
  ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
  >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
  <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
  ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
  v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
    result: "9021",
  },
  // part2: {
  //   input: ``,
  //   result: "",
  // },
});

export default task;

// 1397251 - high
// 1392847
