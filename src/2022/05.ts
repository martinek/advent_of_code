import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

type State = string[][];

const parseState = (i: string): State => {
  const rows = i.split("\n");
  const lastRow = rows[rows.length - 1];
  const stacksCount = lastRow.split(/\W+/).filter((s) => s.length !== 0).length;
  const stacks: State = new Array(stacksCount).fill(1).map(() => []);

  rows.slice(0, rows.length - 1).forEach((row) => {
    const l = row.length / stacksCount;
    for (let i = 0; i < stacksCount; i++) {
      const col = row.slice(i * l, (i + 1) * l).trim();
      if (col !== "") {
        stacks[i].push(col.slice(1, col.length - 1));
      }
    }
  });

  return stacks.map((s) => s.reverse());
};

const executeStep = (state: State, instruction: string, version: 9000 | 9001): State => {
  if (instruction === "") return state;

  const [move, from, to] = instruction
    .slice(4)
    .split(/from|to/)
    .map(Number);

  const result = state.map((s) => [...s]);
  if (version === 9000) {
    for (let n = 0; n < move; n++) {
      const l = result[from - 1].pop();
      if (l) {
        result[to - 1].push(l);
      }
    }
  } else {
    const l = result[from - 1].splice(result[from - 1].length - move);
    result[to - 1].push(...l);
  }

  return result;
};

const getResult = (state: State): string => {
  return state.map((s) => s.pop()).join("");
};

const part1: TaskPartSolution = (input) => {
  const [stateStr, program] = input.split("\n\n");

  let state = parseState(stateStr);

  for (const instruction of program.split("\n")) {
    state = executeStep(state, instruction, 9000);
  }

  return getResult(state);
};

const part2: TaskPartSolution = (input) => {
  const [stateStr, program] = input.split("\n\n");

  let state = parseState(stateStr);

  for (const instruction of program.split("\n")) {
    state = executeStep(state, instruction, 9001);
  }

  return getResult(state);
};

const task = new Task(2022, 5, part1, part2);

export default task;
