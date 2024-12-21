import Task, { TaskPartSolution } from "../utils/task.js";

// const TESTS = [
//   ["029A", "<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A"],
//   ["980A", "<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A"],
//   ["179A", "<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"],
//   ["456A", "<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A"],
//   ["379A", "<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"],
// ];

/**
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+
*/
const G1: string = "789\n456\n123\n 0A";
/**
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/
const G2: string = " ^A\n<v>";

const N = [
  [[0, 1], "v"],
  [[0, -1], "^"],
  [[1, 0], ">"],
  [[-1, 0], "<"],
] as const;

const CACHE = new Map<string, string[]>();

const path = (graphString: string, from: string, to: string): string[] => {
  const key = graphString + "_" + from + "_" + to;
  if (CACHE.has(key)) {
    return CACHE.get(key)!;
  }
  const graph = new Map<string, [number, number]>();
  const map = graphString.split("\n").map((row, y) =>
    row.split("").map((cell, x) => {
      graph.set(cell, [x, y]);
      return cell;
    })
  );
  let res: string[] = [];

  const start = graph.get(from);
  const end = graph.get(to);

  if (!start || !end) {
    throw new Error("Invalid start or end");
  }

  const queue = [{ node: start, path: "" }];
  let minLen = Infinity;
  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (node[0] === end[0] && node[1] === end[1]) {
      if (path.length < minLen) {
        res = [path]; // if new path is best, remove previous paths
        minLen = path.length;
      } else {
        res.push(path);
      }
      continue;
    }
    N.forEach(([[dx, dy], move]) => {
      const x = node[0] + dx;
      const y = node[1] + dy;
      const cell = map[y]?.[x];
      if (cell === undefined || cell === " ") return;
      const npath = path + move;
      if (npath.length >= minLen) return; // do not add to queue if path is longer than minLen
      queue.push({ node: [x, y], path: path + move });
    });
  }

  CACHE.set(key, res);
  return res;
};

const CACHE2 = new Map<string, string[]>();
const encode = (graphString: string, input: string): string[] => {
  const key = graphString + "_" + input;
  if (CACHE2.has(key)) {
    return CACHE2.get(key)!;
  }
  let res: string[] = [];
  const nodes = ("A" + input).split("");

  for (let i = 0; i < nodes.length - 1; i++) {
    // not last, need pairs
    const from = nodes[i];
    const to = nodes[i + 1];
    const paths = path(graphString, from, to);
    // console.log(from, to, paths);
    if (res.length === 0) {
      res = paths.map((p) => p + "A");
    } else {
      res = paths.flatMap((p) => res.map((r) => r + p + "A"));
    }
  }

  CACHE2.set(key, res);
  return res;
};

const keepShortest = (paths: string[]): string[] => {
  let minLen = Infinity;
  paths.forEach((p) => (minLen = Math.min(p.length, minLen)));
  return paths.filter((p) => p.length === minLen);
};

const solveCode = (code: string, d: number): number => {
  const paths = encode(G1, code);

  let i = d;

  let round: Set<string> = new Set<string>(paths);
  while (i > 0) {
    const newRound = new Set<string>();
    round.forEach((p) => {
      const l = encode(G2, p); // all paths will have same length
      l.forEach((p2) => newRound.add(p2));
    });
    round = newRound;
    console.log(">>>", code, d - i, round.size);
    i--;
  }

  const res = keepShortest(Array.from(round.values()));
  const l = res[0].length;
  console.log(code, l, Number(code.replaceAll("A", "")));
  return l * Number(code.replaceAll("A", ""));
};

const part1: TaskPartSolution = (input) => {
  const codes = input.split("\n").map((code) => [code, solveCode(code, 2)] as const);
  return codes.reduce((acc, [_, v]) => acc + v, 0).toString();
};
const part2: TaskPartSolution = (input) => {
  const codes = input.split("\n").map((code) => [code, solveCode(code, 25)] as const);
  return codes.reduce((acc, [_, v]) => acc + v, 0).toString();
};

const task = new Task(2024, 21, part1, part2, {
  part1: {
    input: `029A
980A
179A
456A
379A`,
    result: "126384",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
