import Task, { TaskPartSolution } from "../utils/task.js";

interface Input {
  rules: number[][];
  updates: number[][];
}
const parseInput = (input: string): Input => {
  const pts = input.split("\n\n");
  const res: Input = {
    rules: pts[0].split("\n").map((r) => r.split("|").map(Number)),
    updates: pts[1].split("\n").map((line) => line.split(",").map(Number)),
  };
  return res;
};

const part1: TaskPartSolution = (input) => {
  const { rules, updates } = parseInput(input);
  const validUpdates = updates.filter((update) => {
    return rules.every(([a, b]) => {
      const posA = update.indexOf(a);
      const posB = update.indexOf(b);
      if (posA === -1) {
        return true;
      } else if (posB === -1) {
        return true;
      } else {
        return posA < posB;
      }
    });
  });
  return validUpdates.reduce((acc, update) => acc + update[(update.length - 1) / 2], 0);
};
const part2: TaskPartSolution = (input) => {
  const { rules, updates } = parseInput(input);
  const invalidUpdates = updates.filter((update) => {
    return !rules.every(([a, b]) => {
      const posA = update.indexOf(a);
      const posB = update.indexOf(b);
      if (posA === -1) {
        return true;
      } else if (posB === -1) {
        return true;
      } else {
        return posA < posB;
      }
    });
  });
  const rulesSort = (a: number, b: number) => {
    const rule = rules.find(([x, y]) => (x === a || y === a) && (x === b || y === b));
    if (rule != null) {
      return rule[0] === a ? -1 : 1;
    }
    return 0;
  };
  return invalidUpdates
    .map((update) => update.sort(rulesSort))
    .reduce((acc, update) => acc + update[(update.length - 1) / 2], 0);
};

const task = new Task(2024, 5, part1, part2, {
  part1: {
    input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
    result: "143",
  },
  part2: {
    input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
    result: "123",
  },
});

export default task;
