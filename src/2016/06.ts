import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const messages = input.split("\n");
  const counts: { [char: string]: number }[] = [];
  messages.forEach((message) => {
    for (let i = 0; i < message.length; i++) {
      if (!counts[i]) {
        counts[i] = {};
      }
      const char = message[i];
      counts[i][char] = (counts[i][char] || 0) + 1;
    }
  });

  let result = "";
  counts.forEach((count) => {
    const sorted = Object.keys(count).sort((a, b) => {
      if (count[a] === count[b]) {
        return a < b ? -1 : 1;
      }
      return count[b] - count[a];
    });
    result += sorted[0];
  });

  return result;
};
const part2: TaskPartSolution = (input) => {
  const messages = input.split("\n");
  const counts: { [char: string]: number }[] = [];
  messages.forEach((message) => {
    for (let i = 0; i < message.length; i++) {
      if (!counts[i]) {
        counts[i] = {};
      }
      const char = message[i];
      counts[i][char] = (counts[i][char] || 0) + 1;
    }
  });

  let result = "";
  counts.forEach((count) => {
    const sorted = Object.keys(count).sort((a, b) => {
      if (count[a] === count[b]) {
        return a < b ? -1 : 1;
      }
      return count[a] - count[b];
    });
    result += sorted[0];
  });

  return result;
};

const task = new Task(2016, 6, part1, part2, {
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
