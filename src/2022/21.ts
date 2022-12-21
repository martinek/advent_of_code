import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

type Operation = "+" | "-" | "*" | "/";

interface Op {
  value?: number;
  args?: [string, string];
  operation?: Operation;
}

interface Ops {
  [key: string]: Op;
}

const parseOps = (input: string): Ops => {
  const ops: Ops = {};

  input.split("\n").map((r) => {
    const [key, op] = r.split(": ");
    const opPts = op.split(" ");
    if (opPts.length === 1) {
      ops[key] = { value: Number(op) };
    } else {
      ops[key] = { args: [opPts[0], opPts[2]], operation: opPts[1] as Operation };
    }
  });

  return ops;
};

const execOp = (op: Op, a: number, b: number) => {
  switch (op.operation) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
  }
};

const reverseOp = (op: Op, result: number, a: number, b: number): number => {
  if (op.operation === undefined) return result; // this should not happen, but...

  if (isNaN(a)) {
    switch (op.operation) {
      case "+":
        return result - b;
      case "-":
        // return a - b;
        return result + b;
      case "*":
        return result / b;
      case "/":
        // return a / b;
        return result * b;
    }
  } else {
    // b isNaN
    switch (op.operation) {
      case "+":
        return result - a;
      case "-":
        // return a - b;
        return a - result;
      case "*":
        return result / a;
      case "/":
        // return a / b;
        return a / result;
    }
  }
};

const resolveOp = (ops: Ops, key: string): number => {
  const op = ops[key];
  if (op.value == null) {
    const [a, b] = op.args!.map((key) => resolveOp(ops, key));
    op.value = execOp(op, a, b);
  }
  return op.value!;
};

const resolveValue = (ops: Ops, targetKey: string, targetValue: number): number => {
  const op = ops[targetKey];

  const [a, b] = op.args!.map((k) => ops[k].value!);

  const tValue = reverseOp(op, targetValue, a, b);
  const tKey = op.args![isNaN(a) ? 0 : 1];

  if (ops[tKey].args == null) return tValue;

  return resolveValue(ops, tKey, tValue);
};

const part1: TaskPartSolution = (input) => {
  const ops = parseOps(input);
  return resolveOp(ops, "root");
};

const part2: TaskPartSolution = (input) => {
  const ops = parseOps(input);
  ops["humn"].value = NaN;

  const root = ops["root"];
  const [a, b] = root.args!.map((k) => resolveOp(ops, k));

  let targetKey: string;
  let targetValue: number;
  if (isNaN(a)) {
    targetKey = root.args![0];
    targetValue = b;
  } else {
    targetKey = root.args![1];
    targetValue = a;
  }

  return resolveValue(ops, targetKey, targetValue);
};

const task = new Task(2022, 21, part1, part2);

export default task;
