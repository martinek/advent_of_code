import Task, { TaskPartSolution } from "../utils/task.js";

const comboOp = (state: State, value: bigint): bigint => {
  if (0 <= value && value <= 3) return value;
  if (value === 4n) return state.a;
  if (value === 5n) return state.b;
  if (value === 6n) return state.c;
  throw new Error(`Invalid combo operand value: ${value}`);
};

// "The denominator is found by raising 2 to the power of combo operand.
// The result of the division operation is truncated to an integer and then
// written to the A register."
//
// The above is the same as shifting the A register to the right by the
// number of bits specified by the combo operand.
const dv = (state: State, argument: bigint): bigint => {
  return state.a >> comboOp(state, argument);
};

const adv = (state: State, argument: bigint) => {
  state.pointer += 2n;
  state.a = dv(state, argument);
};

const bxl = (state: State, argument: bigint) => {
  state.pointer += 2n;
  state.b = state.b ^ argument;
};

const bst = (state: State, argument: bigint) => {
  state.pointer += 2n;
  state.b = comboOp(state, argument) & 0b111n;
};

const jnz = (state: State, argument: bigint) => {
  state.pointer = state.a !== 0n ? argument : state.pointer + 2n;
};

const bxc = (state: State, _argument: bigint) => {
  state.pointer += 2n;
  state.b = state.b ^ state.c;
};

const out = (state: State, argument: bigint) => {
  state.pointer += 2n;
  state.output.push(comboOp(state, argument) & 0b111n);
};

const bdv = (state: State, argument: bigint) => {
  state.pointer += 2n;
  state.b = dv(state, argument);
};

const cdv = (state: State, argument: bigint) => {
  state.pointer += 2n;
  state.c = dv(state, argument);
};

const ops = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const execute = (state: State, program: Program) => {
  const opcode = program[Number(state.pointer)];
  const argument = program[Number(state.pointer) + 1];
  ops[Number(opcode)](state, argument);
};

// Use bigint for everything, so types dont have to be changed when
// assigning between values. Realistically, only a needs to be a bigint.
interface State {
  a: bigint;
  b: bigint;
  c: bigint;
  pointer: bigint;
  output: bigint[];
}

type Program = bigint[];

const parseInput = (input: string): [State, Program] => {
  const state: State = { a: 0n, b: 0n, c: 0n, pointer: 0n, output: [] };
  const program: Program = [];

  for (const line of input.split("\n")) {
    if (line.startsWith("Register ")) {
      const [register, value] = line.slice(9).split(": ");
      state[register.toLowerCase() as "a" | "b" | "c"] = BigInt(value);
    }
    if (line.startsWith("Program: ")) {
      program.push(...line.slice(9).split(",").map(BigInt));
    }
  }
  return [state, program];
};

const getOutput = (state: State, program: Program): bigint[] => {
  // Execute program until the pointer is out of bounds (program ended).
  while (true) {
    execute(state, program);
    if (state.pointer >= program.length) {
      break;
    }
  }
  return state.output;
};

const part1: TaskPartSolution = (input) => {
  let [state, program] = parseInput(input);

  const out = getOutput(state, program);

  return out.join(",");
};

// This expects the program to behave specifically:
// - The last operation is jumping to the *first* operation.
// - The second to last operation is `adv(3)` which basically discards 3 bits from A.
//
// For each output value we want to achieve, we have to check what three bits
// need to be added to the A, so that the output produces the desired value.
const findMin = (prog: Program, res: bigint[], input: bigint, offset: bigint): bigint | undefined => {
  if (offset === BigInt(res.length)) {
    return input;
  }

  for (let i = 0n; i < 8; i++) {
    const a = (input << 3n) + i;
    const out = getOutput({ a, b: 0n, c: 0n, pointer: 0n, output: [] }, prog);
    if (out[0] === res[Number(offset)]) {
      const minInput = findMin(prog, res, a, offset + 1n);
      if (minInput) {
        return minInput;
      }
    }
  }
  return undefined;
};

const part2: TaskPartSolution = (input) => {
  let [_state, program] = parseInput(input);

  const res = program.toReversed();

  return findMin(program, res, 0n, 0n)!.toString();
};

const task = new Task(2024, 17, part1, part2, {
  part1: {
    input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
    result: "4,6,3,5,6,3,5,2,1,0",
  },
  part2: {
    input: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
    result: "117440",
  },
});

export default task;
// 1359348 - low
