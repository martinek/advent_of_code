import dotenv from "dotenv";
import Task from "./2022/utils/task";
dotenv.config();

async function main() {
  const day = process.argv[2];
  if (day == null) {
    console.log("Missing / invalid day number");
    process.exit(1);
  }

  console.log(`Running day #${day}!`);

  const task = (await import(`./2022/${day}.js`)).default as Task;
  const results = await task.exec();

  console.log(results);
}

main();
