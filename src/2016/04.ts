import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const realRooms = input.split("\n").filter((r) => {
    const [name, sector, checksum] = r.match(/([a-z-]+)-(\d+)\[([a-z]+)\]/)!.slice(1);
    const letters = name
      .replace(/-/g, "")
      .split("")
      .reduce((acc: { [key: string]: number }, l: string) => {
        acc[l] = (acc[l] || 0) + 1;
        return acc;
      }, {});
    const sorted = Object.keys(letters).sort((a, b) => {
      if (letters[a] === letters[b]) {
        return a < b ? -1 : 1;
      }
      return letters[b] - letters[a];
    });
    return sorted.slice(0, 5).join("") === checksum;
  });

  return realRooms.reduce((acc, r) => {
    const [name, sector] = r.match(/([a-z-]+)-(\d+)/)!.slice(1);
    const shift = Number(sector) % 26;
    const decrypted = name
      .split("")
      .map((l) => {
        if (l === "-") {
          return " ";
        }
        const code = l.charCodeAt(0) - 97;
        const shifted = (code + shift) % 26;
        return String.fromCharCode(shifted + 97);
      })
      .join("");
    if (decrypted.includes("north")) {
      console.log(decrypted, sector);
    }
    return acc + Number(sector);
  }, 0);
};
const part2: TaskPartSolution = (input) => "";

const task = new Task(2016, 4, part1, part2, {
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
