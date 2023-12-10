import Task, { TaskPartSolution } from "../utils/task.js";

type Pos = { x: number; y: number };
type Letter = "7" | "J" | "L" | "F" | "S" | "|" | "-" | ".";
type Maze = Letter[][];

interface Node {
  pos: Pos;
  l: Letter;
}

const parseMaze = (input: string): [Maze, Pos] => {
  let start: Pos | undefined;
  const res = input.split("\n").map((r, y) =>
    r
      .trim()
      .split("")
      .map((l, x) => {
        if (l === "S") start = { x, y };
        return l as Letter;
      })
  );

  if (start === undefined) {
    throw new Error("Start not found");
  }
  return [res, start];
};

const printMaze = (maze: Maze): void => {
  const charMap: Record<Letter, string> = {
    F: "┏",
    "-": "━",
    "7": "┓",
    L: "┗",
    J: "┛",
    "|": "┃",
    S: "█",
    ".": " ",
  };
  const r = maze.map((row) => row.map((r) => charMap[r]).join("")).join("\n");

  console.log(r);
};

type Neighbor = [-1 | 0 | 1, -1 | 0 | 1];
const NS: Neighbor[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const LETTER_NS: Record<Letter, Neighbor[]> = {
  F: [NS[1], NS[2]],
  "-": [NS[1], NS[3]],
  "7": [NS[3], NS[2]],
  "|": [NS[0], NS[2]],
  J: [NS[0], NS[3]],
  L: [NS[0], NS[1]],
  S: NS,
  ".": [],
};
const solveMaze = (maze: Maze, start: Pos): Node[] => {
  const getNext = (current: Node, prev: Node | undefined): Node => {
    const { l, pos } = current;

    const ns = LETTER_NS[l]
      .map((d) => {
        const np: Pos = { x: pos.x + d[1], y: pos.y + d[0] };
        const nl = maze[np.y]?.[np.x];

        if (nl == null) return null; // ignore stuff out of bounds
        if (np.y === prev?.pos.y && np.x === prev?.pos.x) return null; // ignore prev node
        if (nl === ".") return null;

        const node: Node = { l: nl, pos: np };
        // TODO: maybe make sure node is connecting?

        // When starting, check the other node to make sure it connects
        if (l === "S") {
          const otherNs = LETTER_NS[nl].filter((d) => np.x + d[1] === pos.x && np.y + d[0] === pos.y);
          if (otherNs.length === 0) return null;
        }

        return node;
      })
      .filter(Boolean)[0];

    if (ns == null) {
      throw new Error("This should not happen");
    }
    return ns;
  };

  const path: Node[] = [];
  const startNode = { l: maze[start.y][start.x], pos: start };
  path.push(startNode);

  while (true) {
    const n = getNext(path[path.length - 1], path[path.length - 2]);
    if (n.pos.x === start.x && n.pos.y === start.y) {
      break;
    }
    path.push(n);
  }

  return path;
};

const part1: TaskPartSolution = (input) => {
  const [maze, start] = parseMaze(input);
  // printMaze(maze);
  const path = solveMaze(maze, start);
  return path.length / 2;
};

const buildClearMaze = (maze: Maze, path: Node[]): Maze => {
  const newMaze: Maze = maze.map((r) => r.map((l) => "."));
  path.forEach((n) => {
    if (n.l === "S") {
      const leftN = maze[n.pos.y][n.pos.x - 1];
      const topN = maze[n.pos.y - 1]?.[n.pos.x];
      if (leftN === "-" || leftN === "F" || leftN === "L") {
        if (topN === "7" || topN === "F" || topN === "|") {
          n.l = "J";
        } else {
          const rightN = maze[n.pos.y][n.pos.x + 1];
          if (rightN === "-" || rightN === "7" || rightN === "J") {
            n.l = "-";
          } else {
            n.l = "7";
          }
        }
      } else {
        if (topN === "7" || topN === "F" || topN === "|") {
          const rightN = maze[n.pos.y][n.pos.x + 1];
          if (rightN === "-" || rightN === "7" || rightN === "J") {
            n.l = "-";
          } else {
            n.l = "7";
          }
        } else {
          n.l = "F";
        }
      }
    }
    newMaze[n.pos.y][n.pos.x] = n.l;
  });
  return newMaze;
};

const countInsize = (maze: Maze): number => {
  let n = 0;
  let isIn = false;
  maze.forEach((row, y) => {
    isIn = false;
    // console.log(row.join(""));
    row.forEach((l, x) => {
      if (!isIn && (l === "7" || l === "|" || l === "F")) {
        isIn = true;
      } else if (isIn && (l === "7" || l === "|" || l === "F")) {
        isIn = false;
      }
      // process.stdout.write(`${isIn ? (l === "." ? "█" : "x") : " "}`);

      if (l === ".") {
        if (isIn) {
          // console.log({ x, y }, "is in");
          n += 1;
        }
      }

      // if (isIn && (l === "7" || l === "|" || l === "F" || l === "L")) {
      //   isIn = !isIn;
      // } else if (!isIn && (l === "7" || l === "J" || l === "|" || l === "F" || l === "L")) {
      // }
    });
    // console.log("");
  });
  return n;
};

const part2: TaskPartSolution = (input) => {
  const [maze, start] = parseMaze(input);
  // printMaze(maze);
  const path = solveMaze(maze, start);
  const maze2 = buildClearMaze(maze, path);
  // printMaze(maze2);

  const inside = countInsize(maze2);

  return inside;
};

const task = new Task(2023, 10, part1, part2, {
  part1: {
    input: `..F7.
            .FJ|.
            SJ.L7
            |F--J
            LJ...`,
    result: "8",
  },
  //   part2: {
  //     input: `.F----7F7F7F7F-7....
  // .|F--7||||||||FJ....
  // .||.FJ||||||||L7....
  // FJL7L7LJLJ||LJ.L-7..
  // L--J.L7...LJS7F-7L7.
  // ....F-J..F7FJ|L7L7L7
  // ....L7.F7||L7|.L7L7|
  // .....|FJLJ|FJ|F7|.LJ
  // ....FJL-7.||.||||...
  // ....L---J.LJ.LJLJ...`,
  //     result: "8",
  //   },
  part2: {
    input: `FF7FSF7F7F7F7F7F---7
            L|LJ||||||||||||F--J
            FL-7LJLJ||||||LJL-77
            F--JF--7||LJLJ7F7FJ-
            L---JF-JLJ.||-FJLJJ7
            |F|F-JF---7F7-L7L|7|
            |FFJF7L7F-JF7|JL---7
            7-L-JL7||F7|L7F-7F7|
            L.L7LFJ|||||FJL7||LJ
            L7JLJL-JLJLJL--JLJ.L`,
    result: "10",
  },
});

export default task;

// 430 - high
