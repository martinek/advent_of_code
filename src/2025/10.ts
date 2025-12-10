import { SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

class Machine {
  lights: boolean[];
  buttons: number[][];
  joltage: number[];

  constructor(line: string) {
    const [ligtsString, ...rest] = line.split(" ");
    const buttonsStrings = rest.slice(0, -1);
    this.lights = ligtsString
      .slice(1, -1)
      .split("")
      .map((c) => c === "#");
    this.buttons = buttonsStrings.map((s) =>
      s
        .slice(1, -1)
        .split(",")
        .map((n) => parseInt(n))
    );
    this.joltage = rest
      .slice(-1)[0]
      .slice(1, -1)
      .split(",")
      .map((n) => parseInt(n));
  }

  initLights(): number {
    const target: number = parseInt(this.lights.map((l) => (l ? "1" : "0")).join(""), 2);
    const options = this.buttons.map((btn) => {
      return btn.reduce((acc, cur) => acc | (1 << (this.lights.length - cur - 1)), 0);
    });

    let r = 0;
    let tmp = new Set([0]);

    while (true) {
      r++;
      tmp = new Set(tmp.entries().flatMap(([state]) => options.map((opt) => state ^ opt)));
      // console.log(tmp);
      if (tmp.has(target)) {
        break;
      }
    }

    return r;
  }

  initJoltage(): number {
    const target = this.joltage.join(",");
    console.log("TARGET", target);
    console.log("BUTTONS", this.buttons);

    let r = 0;
    let tmp = new Set([this.joltage.map(() => 0).join(",")]);

    while (true) {
      r++;
      tmp = new Set(
        tmp
          .entries()
          .map(([s]) => s.split(",").map(Number))
          .flatMap((state) => {
            return this.buttons.map((button) => {
              const newState = [...state];
              button.forEach((pos) => {
                newState[pos] += 1;
              });
              return newState;
            });
          })
          .filter((s) => {
            for (let i = 0; i < s.length; i++) {
              if (s[i] > this.joltage[i]) {
                return false;
              }
            }
            return true;
          })
          .map((s) => s.join(","))
      );
      if (tmp.has(target)) {
        break;
      }
    }

    return r;
  }
}

const part1: TaskPartSolution = (input) => {
  const lines = input.split("\n").filter((l) => l.length > 0);
  const machines = lines.map((line) => new Machine(line));

  return SUM(machines.map((m) => m.initLights()));
};
const part2: TaskPartSolution = (input) => {
  const lines = input.split("\n").filter((l) => l.length > 0);
  const machines = lines.map((line) => new Machine(line));

  return SUM(machines.map((m) => m.initJoltage()));
};

const task = new Task(2025, 10, part1, part2, {
  part1: {
    input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
    result: "7",
  },
  part2: {
    input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
    result: "33",
  },
});

export default task;
