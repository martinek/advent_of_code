import { combinations, SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";
import { Arith, Context, init } from "z3-solver";

const eq = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
const stateKey = (state: number[]) => state.join(",");

class Path {
  state: number[];
  depth: number;
  lastButtonPressed?: number[];

  constructor(state: number[], depth: number, lastButtonPressed?: number[]) {
    this.state = state;
    this.depth = depth;
    this.lastButtonPressed = lastButtonPressed;
  }

  get key(): string {
    return stateKey(this.state);
  }

  getPaths(buttons: number[][], target: number[], bestDepth: number): [Path[], Path[]] {
    const res: Path[] = [];
    const res2: Path[] = [];

    for (const button of buttons) {
      // skip last button pressed to avoid cycles
      if (this.lastButtonPressed && eq(button, this.lastButtonPressed)) {
        continue;
      }
      // Create new path by pressing the button as many times as possible without overshooting
      let maxPresses = Infinity;
      button.forEach((pos) => {
        const presses = target[pos] - this.state[pos];
        if (presses < maxPresses) {
          maxPresses = presses;
        }
      });

      if (maxPresses !== Infinity && maxPresses > 0 && this.depth + maxPresses < bestDepth) {
        res.push(this.pressButton(button, maxPresses));
        // if (maxPresses > 1) {
        //   res2.push(this.pressButton(button, maxPresses - 1));
        // }
        // if (maxPresses > buttons.length) {
        //   res2.push(this.pressButton(button, maxPresses - buttons.length + 1));
        // }
        // if (maxPresses > 1) {
        //   res2.push(this.pressButton(button, Math.floor(maxPresses / 2)));
        // }
        // for (let i = 1; i <= buttons.length - 1; i++) {
        //   if (maxPresses - i > 0) {
        //     res2.push(this.pressButton(button, maxPresses - i));
        //   }
        // }
      }
    }

    return [res, res2];
  }

  pressButton(button: number[], times: number): Path {
    const newState = [...this.state];
    button.forEach((pos) => {
      newState[pos] += times;
    });
    return new Path(newState, this.depth + times, button);
  }
}

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

  async initJoltage(context: Context): Promise<number> {
    const { Optimize, Int } = context;

    const solver = new Optimize();
    const buttonPressesVars: Arith<"main">[] = [];

    // Create counter for number of presses of each button
    this.buttons.forEach((_, i) => {
      const buttonPressesVar = Int.const(`button_${i}_presses`);
      solver.add(buttonPressesVar.ge(0));
      buttonPressesVars.push(buttonPressesVar);
    });

    // Each joltage must equal sum of buttons affecting it
    this.joltage.forEach((targetJoltage, pos) => {
      let condition: Arith<"main"> = Int.val(0);
      this.buttons.forEach((button, i) => {
        // If button affects this joltage, add its presses to the condition
        if (button.includes(pos)) {
          condition = condition.add(buttonPressesVars[i]);
        }
      });
      // Resulting sum must equal to target joltage
      solver.add(condition.eq(Int.val(targetJoltage)));
    });

    // Tell solver to minimize total number of button presses
    // Create sum of all button presses
    const totalPresses = buttonPressesVars.reduce((acc, cur) => acc.add(cur), Int.val(0));
    solver.minimize(totalPresses);

    const result = await solver.check();

    if (result !== "sat") {
      throw new Error("No solution found");
    }

    return Number(solver.model().eval(totalPresses).toString());
  }
}

const part1: TaskPartSolution = (input) => {
  const lines = input.split("\n").filter((l) => l.length > 0);
  const machines = lines.map((line) => new Machine(line));

  return SUM(machines.map((m) => m.initLights()));
};

const part2: TaskPartSolution = async (input) => {
  const { Context } = await init();

  const lines = input.split("\n").filter((l) => l.length > 0);
  const machines = lines.map((line) => new Machine(line)); //.slice(0, 1); // Only first machine for part 2

  const res = [];
  for (const m of machines) {
    res.push(await m.initJoltage(Context("main")));
  }

  return SUM(res);
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
