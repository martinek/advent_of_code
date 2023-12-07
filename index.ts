import dotenv from "dotenv";
import Task from "./src/utils/task.js";
dotenv.config();

import { Command } from "commander";
import fs from "fs";
import { COLOR, lPad } from "./src/utils/helpers.js";

const program = new Command()
  .option("-t, --test", "run task tests")
  .argument("[string]", "task identifier in form of YYYY-DD or YYYY-DD-P");

const invalidTarget = (t?: string) => {
  console.log(`Missing / invalid task identifier${t ? ` (${t})` : ""}
  Use format YYYY-DD-P where:
    YYYY - Year, optional. If omitted, current year will be used.
    DD   - Day, required. Uses two digit format (ie. 04)
    P    - Task part, optional. If ommited, both parts will be run.
  `);
  process.exit(1);
};

interface Target {
  year: string;
  day: string;
  part?: string;
}

const parseTarget = (target?: string): Target => {
  if (target == null) {
    const d = new Date();
    target = `${d.getFullYear()}-${lPad(d.getDate().toString(), 2, "0")}`;
  }

  let [year, day, part] = target.split("-");
  if (year.length === 2) {
    part = day;
    day = year;
    year = new Date().getFullYear().toString();
  }

  if (year.length !== 4 || day.length !== 2 || (part != null && part.length !== 1)) {
    return invalidTarget(`${year}-${day}-${part}`);
  }

  return { year, day, part };
};

const getTask = async (target: Target): Promise<Task> => {
  const { year, day } = target;
  if (!fs.existsSync(`./src/${year}/${day}.ts`)) {
    const template = fs.readFileSync(`./src/utils/_template.ts.txt`).toString();
    const taskFileContent = template
      .replaceAll("%YEAR%", Number(year).toString())
      .replaceAll("%DAY%", Number(day).toString());
    fs.writeFileSync(`./src/${year}/${day}.ts`, taskFileContent);
  }

  const task = (await import(`./src/${year}/${day}.js`)).default as Task;
  return task;
};

const resolveTask = async (): Promise<{ target: Target; task: Task; test: boolean }> => {
  const options = program.parse();
  const target = parseTarget(options.args[0]);
  const task = await getTask(target);
  return { target, task, test: options.getOptionValue("test") };
};

async function main() {
  const { target, task, test } = await resolveTask();
  console.log(`Running ${test ? "tests for" : "task of"} day #${target.day}!`);

  const results = await task[test ? "test" : "exec"](target.part);
  results.forEach((res, i) => {
    if (res == null) return;
    console.log(
      `\n${COLOR.FgCyan}=== Part ${i} ===${COLOR.Reset}\n${COLOR.Bright}${res.result}${COLOR.Reset}\n${res.time} ns`
    );
  });
}

main();
