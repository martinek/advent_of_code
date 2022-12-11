import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

class Monkey {
  items: bigint[];
  operation: (item: bigint) => bigint;
  test: bigint;
  targets: { 1: number; 0: number };

  inspections = 0;

  constructor(input: string) {
    const [_, startingItems, operation, test, actionTrue, actionFalse] = input.split("\n");
    this.items = startingItems.split(": ")[1].split(", ").map(BigInt);
    this.operation = this.parseOperation(operation.split(": ")[1]);
    this.test = BigInt(test.split("divisible by ")[1]);
    this.targets = {
      1: Number(actionTrue.split("monkey ")[1]),
      0: Number(actionFalse.split("monkey ")[1]),
    };
  }

  private parseOperation(op: string) {
    const [i1, operand, i2] = op.split(" = ")[1].split(" ");

    return (item: bigint) => {
      const n1 = i1 === "old" ? item : BigInt(i1);
      const n2 = i2 === "old" ? item : BigInt(i2);

      switch (operand) {
        case "*":
          return n1 * n2;
        case "+":
          return n1 + n2;
        default:
          throw new Error("Unknown op");
      }
    };
  }
}

class State {
  monkeys: Monkey[];

  constructor(input: string) {
    this.monkeys = input.split("\n\n").map((i) => new Monkey(i));
  }
}

const part1: TaskPartSolution = (input) => {
  const ROUNDS = 20;
  const state = new State(input);

  const printItems = () => {
    state.monkeys.forEach((m, i) => console.log(`Monkey ${i}:`, m.items));
  };
  const printInspections = () => {
    state.monkeys.forEach((m, i) => console.log(`Monkey ${m.inspections}`));
  };

  for (let r = 0; r < ROUNDS; r++) {
    // console.log(`Round ${r}`);
    for (let m = 0; m < state.monkeys.length; m++) {
      const monkey = state.monkeys[m];
      // console.log(`  Monkey ${m}`);
      while (monkey.items.length > 0) {
        const [item] = monkey.items.splice(0, 1);
        // console.log(`    Monkey inspects an item with a worry level of ${item}.`);
        const level = monkey.operation(item) / BigInt(3);
        // console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${level}.`);
        const testResult = level % monkey.test === BigInt(0);
        // console.log(`    Current worry level is${testResult ? "" : " not"} divisible by ${monkey.test}.`);
        const target = monkey.targets[testResult ? 1 : 0];
        monkey.inspections += 1;

        // console.log(`    Item with worry level ${level} is thrown to monkey ${target}.`);
        state.monkeys[target].items.push(level);
        // console.log("");
      }
    }
    // printItems();
  }

  // printInspections();

  const [first, second] = state.monkeys.map((m) => m.inspections).sort((a, b) => b - a);
  return (first * second).toString();
};

const part2: TaskPartSolution = (input) => {
  const ROUNDS = 10000;
  const state = new State(input);

  const maxVal = Array(...new Set(state.monkeys.map((m) => m.test))).reduce((acc, n) => acc * n);

  for (let r = 0; r < ROUNDS; r++) {
    for (let m = 0; m < state.monkeys.length; m++) {
      const monkey = state.monkeys[m];
      while (monkey.items.length > 0) {
        const [item] = monkey.items.splice(0, 1);
        const level = monkey.operation(item) % maxVal;
        const testResult = level % monkey.test === BigInt(0);
        const target = monkey.targets[testResult ? 1 : 0];
        monkey.inspections += 1;
        state.monkeys[target].items.push(level);
      }
    }
  }

  const [first, second] = state.monkeys.map((m) => m.inspections).sort((a, b) => b - a);
  return (first * second).toString();
};

const task = new Task(2022, 11, part1, part2);

export default task;
