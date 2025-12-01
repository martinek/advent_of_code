import Task, { TaskPartSolution } from "../utils/task.js";

// const TESTS = [
//   ["029A", "<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A"],
//   ["980A", "<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A"],
//   ["179A", "<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"],
//   ["456A", "<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A"],
//   ["379A", "<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"],
// ];

/**

           3                          7          9                 A
       ^   A       ^^        <<       A     >>   A        vvv      A
   <   A > A   <   AA  v <   AA >>  ^ A  v  AA ^ A  v <   AAA ^  > A
v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A^>AA<A>Av<A<A>>^AAA<Av>A^A

           3                      7          9                 A
       ^   A         <<      ^^   A     >>   A        vvv      A
   <   A > A  v <<   AA >  ^ AA > A  v  AA ^ A   < v  AAA >  ^ A
<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
*/

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

const str = (char: string, times: number): string => {
  return Array.from({ length: times })
    .map(() => char)
    .join("");
};

const CACHE = new Map<string, string>();

const path = (graphString: string, from: string, to: string): string => {
  if (from === to) return "";

  const key = graphString + "_" + from + "_" + to;
  if (CACHE.has(key)) {
    return CACHE.get(key)!;
  }
  const graph = new Map<string, [number, number]>();
  graphString.split("\n").forEach((row, y) =>
    row.split("").forEach((cell, x) => {
      graph.set(cell, [x, y]);
    })
  );

  const start = graph.get(from);
  const end = graph.get(to);

  if (!start || !end) {
    throw new Error("Invalid start or end");
  }

  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  let path = "";
  if (start[0] === 0) {
    // if start is on first column, move horizontally first
    path += str(dx > 0 ? ">" : "<", Math.abs(dx));
    path += str(dy > 0 ? "v" : "^", Math.abs(dy));
  } else {
    // first move vertically
    path += str(dy > 0 ? "v" : "^", Math.abs(dy));
    path += str(dx > 0 ? ">" : "<", Math.abs(dx));
  }

  console.log(from, to, path);

  CACHE.set(key, path);
  return path;
};

const CACHE2 = new Map<string, string>();
const encode = (graphString: string, input: string, times = 0): string => {
  const key = graphString + "_" + input + "_" + times;
  if (CACHE2.has(key)) {
    return CACHE2.get(key)!;
  }

  const nodes = input.split("");
  let res: string = "";

  if (nodes.length === 2) {
    res = path(graphString, nodes[0], nodes[1]);
  } else {
    for (let i = 0; i < nodes.length - 1; i++) {
      // not last, need pairs
      const from = nodes[i];
      const to = nodes[i + 1];
      const p = path(graphString, from, to);
      res += p + "A";
      // // console.log(from, to, paths);
      // if (res.length === 0) {
      //   res = paths.map((p) => p + "A");
      // } else {
      //   res = paths.flatMap((p) => res.map((r) => r + p + "A"));
      // }
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
  const p = encode(G1, "A" + code);

  console.log(code, p);

  let i = d;

  let res = p;
  while (i > 0) {
    res = encode(G2, "A" + res);
    console.log(res);
    i--;
  }

  // const res = keepShortest(Array.from(round.values()));
  // const l = res[0].length;
  console.log(code, res.length, Number(code.replaceAll("A", "")));
  return res.length * Number(code.replaceAll("A", ""));
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
