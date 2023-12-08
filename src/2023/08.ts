import { lcm } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const parseMap = (input: string) => {
  return Object.fromEntries(
    input.split("\n").map((r) => {
      const [a, b] = r.split(" = ");
      const [c, d] = b.slice(1, -1).split(", ");
      return [a, [c, d]];
    })
  );
};

const part1: TaskPartSolution = (input) => {
  const [instructions, mapInput] = input.split("\n\n");
  const map = parseMap(mapInput);

  let node = "AAA";
  let steps = 0;

  while (node !== "ZZZ") {
    const inst = instructions[steps % instructions.length];
    node = map[node][inst === "L" ? 0 : 1];
    steps += 1;
  }

  return steps;
};
const part2: TaskPartSolution = (input) => {
  const [instructions, mapInput] = input.split("\n\n");
  const map = parseMap(mapInput);

  let nodes = Object.keys(map).filter((k) => k.endsWith("A"));
  const nodesCount = nodes.length;
  let steps = 0;

  const loops = nodes.map((n) => ({ start: -1, length: -1 }));
  let nodesOnEnd = nodes.map((k) => k.endsWith("Z"));

  while (nodesOnEnd.filter((n) => n).length !== nodesCount) {
    const inst = instructions[steps % instructions.length];
    nodes = nodes.map((node) => {
      return map[node][inst === "L" ? 0 : 1];
    });
    steps += 1;
    nodesOnEnd = nodes.map((k) => k.endsWith("Z"));
    nodesOnEnd.forEach((end, i) => {
      if (end) {
        if (loops[i].start === -1) {
          // console.log(`found start ${i}: ${steps}`);
          loops[i].start = steps;
          // console.log(loops);
        } else if (loops[i].length === -1) {
          // console.log(`found loop ${i}: ${steps}`);
          loops[i].length = steps - loops[i].start;
          // console.log(loops);
        }
      }
    });
    if (loops.every((l) => l.length !== -1)) {
      break;
    }
  }

  return lcm(loops.map((l) => l.length));
};

const task = new Task(2023, 8, part1, part2, {
  part1: {
    input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
    result: "6",
  },
  part2: {
    input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
    result: "6",
  },
});

export default task;

// start ~7:00, end ~7:28
