import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const pts = input.split("\n\n");
  const gifts = pts.slice(0, -1).map((lines) =>
    SUM(
      lines
        .split("\n")
        .slice(1)
        .map((l) => SUM(l.split("").map((c) => (c === "#" ? 1 : 0))))
    )
  );
  const areasInput = pts[pts.length - 1];
  const areas = areasInput.split("\n").map((line) => {
    const [area, ...areaCounts] = line.split(" ");
    const size = area.slice(0, -1).split("x").map(Number);
    const counts = areaCounts.map((n, i) => gifts[i] * Number(n));
    const room = size[0] * size[1];
    const fit = SUM(counts) <= room;
    // console.log(size, counts, SUM(counts), room, fit);
    return fit ? 1 : 0;
  });
  return SUM(areas);
};
const part2: TaskPartSolution = (input) => "";

const task = new Task(2025, 12, part1, part2, {
  part1: {
    input: ``,
    result: "",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;

// 407 low
