import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";

const detectMarker = (input: string, target: "packet" | "message") => {
  const markerLength = target === "packet" ? 4 : 14;
  let n: number | undefined;
  for (let i = 0; i < input.length; i++) {
    const window = input.slice(i, i + markerLength);
    if (new Set(window.split("")).size === markerLength) {
      return i + markerLength;
    }
  }
  return undefined;
};

const part1: TaskPartSolution = (input) => {
  return detectMarker(input, "packet")?.toString() ?? "";
};
const part2: TaskPartSolution = (input) => {
  return detectMarker(input, "message")?.toString() ?? "";
};

const task = new Task(2022, 6, part1, part2);

export default task;
