import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

const hash = (s: string): number =>
  s.split("").reduce((acc, c) => {
    const n = c.charCodeAt(0);
    return ((acc + n) * 17) % 256;
  }, 0);

const part1: TaskPartSolution = (input) => {
  return SUM(input.split(",").map(hash));
};

interface Lens {
  label: string;
  f: number;
}

const printBoxes = (boxes: Lens[][]) => {
  boxes.forEach((b, i) => {
    if (b.length > 0) {
      console.log(`Box ${i}: ${b.map((l) => `[${l.label} ${l.f}]`).join(" ")}`);
    }
  });
};

const part2: TaskPartSolution = (input) => {
  const boxes: Lens[][] = new Array(256).fill(1).map(() => []);
  const steps = input.split(",");
  steps.forEach((s) => {
    if (s[s.length - 1] === "-") {
      const label = s.slice(0, -1);
      const h = hash(label);
      boxes[h] = boxes[h].filter((l) => l.label !== label);
    } else {
      const [label, n] = s.split("=");
      const h = hash(label);
      const l = boxes[h].find((l) => l.label === label);
      if (l) {
        l.f = Number(n);
      } else {
        boxes[h].push({ f: Number(n), label });
      }
    }
    // console.log(`After "${s}"`);
    // printBoxes(boxes);
    // console.log();
  });

  return SUM(
    boxes.map((b, i) => {
      return SUM(
        b.map((lens, j) => {
          const res = (1 + i) * (j + 1) * lens.f;
          // console.log(lens, res);
          return res;
        })
      );
    })
  );
};

const task = new Task(2023, 15, part1, part2, {
  part1: {
    input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
    result: "1320",
  },
  part2: {
    input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
    result: "145",
  },
});

export default task;
