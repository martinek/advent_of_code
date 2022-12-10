import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput0 = `noop
addx 3
addx -5`;

const sampleInput1 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const part1: TaskPartSolution = (input) => {
  const commands = input.split("\n");
  const xTimeline: number[] = [1];

  for (const cmd of commands) {
    const [command, arg] = cmd.split(" ");
    const lastValue = xTimeline[xTimeline.length - 1];
    switch (command) {
      case "noop":
        xTimeline.push(lastValue);
        break;
      case "addx":
        xTimeline.push(lastValue, lastValue + Number(arg));
        break;
      default:
        break;
    }
  }

  const result = xTimeline.reduce((acc, v, i) => {
    const cycle = i + 1;
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      // console.log(`cycle ${cycle}:`, v, " = ", v * cycle);
      return acc + v * cycle;
    }
    return acc;
  }, 0);

  return result.toString();
};

const part2: TaskPartSolution = (input) => {
  const commands = input.split("\n");
  const xTimeline: number[] = [1];

  for (const cmd of commands) {
    const [command, arg] = cmd.split(" ");
    const lastValue = xTimeline[xTimeline.length - 1];
    switch (command) {
      case "noop":
        xTimeline.push(lastValue);
        break;
      case "addx":
        xTimeline.push(lastValue, lastValue + Number(arg));
        break;
      default:
        break;
    }
  }

  const pixels = xTimeline.reduce<boolean[][]>(
    (acc, v, i) => {
      const rowPos = i % 40;
      const overlap = rowPos >= v - 1 && rowPos <= v + 1;
      acc[acc.length - 1].push(overlap);

      const cycle = i + 1;

      if (cycle % 40 === 0) {
        acc.push([]);
      }

      return acc;
    },
    [[]]
  );

  pixels.forEach((row) => {
    console.log(row.map((v) => (v ? "█" : " ")).join(""));
  });

  return "";
};

const task = new Task(2022, 10, part1, part2);

export default task;
