import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const countAllPaths = (graph: Map<string, string[]>, start: string, end: string): number => {
  const cache: Record<string, number> = {};

  const dfs = (current: string, end: string): number => {
    if (current === end) {
      return 1;
    }
    if (cache[current] != null) {
      return cache[current];
    }
    // Count to current node is sum of counts to all neighbors
    // This only works because the graph is acyclic
    const count = SUM((graph.get(current) ?? []).map((neighbor) => dfs(neighbor, end)));
    cache[current] = count;
    return count;
  };

  return dfs(start, end);
};

const part1: TaskPartSolution = (input) => {
  const lines = input.split("\n");
  const graph = new Map();

  for (const line of lines) {
    const [key, ...values] = line.split(": ");
    graph.set(key, values[0].split(" "));
  }

  return countAllPaths(graph, "you", "out");
};

const part2: TaskPartSolution = (input) => {
  const lines = input.split("\n");
  const graph = new Map();

  for (const line of lines) {
    const [key, ...values] = line.split(": ");
    graph.set(key, values[0].split(" "));
  }

  const pairs = [
    ["svr", "dac"],
    ["svr", "fft"],
    ["dac", "fft"],
    ["dac", "out"],
    ["fft", "dac"],
    ["fft", "out"],
  ];

  const counts = pairs.map(([start, end]) => countAllPaths(graph, start, end));
  return counts[0] * counts[2] * counts[5] + counts[1] * counts[4] * counts[3];
};

const task = new Task(2025, 11, part1, part2, {
  part1: {
    input: `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
    result: "5",
  },
  part2: {
    input: `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
    result: "2",
  },
});

export default task;
