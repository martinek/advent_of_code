import dotenv from "dotenv";
import Task from "./2022/utils/task";
import fs from "fs";
dotenv.config();

async function main() {
  const target = process.argv[2];
  if (target == null) {
    console.log("Missing / invalid day number");
    process.exit(1);
  }

  const [day, taskNumber] = target.split("-");

  console.log(`Running day #${day}!`);

  if (!fs.existsSync(`./2022/${day}.ts`)) {
    const template = fs.readFileSync("./2022/_template.ts.txt").toString();
    const taskFileContent = template.replaceAll("%TASK_NUMBER%", Number(day).toString());
    fs.writeFileSync(`./2022/${day}.ts`, taskFileContent);
  }

  const task = (await import(`./2022/${day}.js`)).default as Task;
  const results = await task.exec(taskNumber);

  console.log(results);
}

main();
