# Advent of code repository

## Setup

For running the tasks, you need your own inputs. You can input them to `.cache` directory manually, or the program will attempt to download them automatically when running the task. Inputs should not be shared publicly as per [AoC author's wishes](https://mobile.twitter.com/ericwastl/status/1465805354214830081).

### Manual input download

The `.cache` directory is flat list of files with task inputs as they are downloaded from AoC site. Each file is named with year and task number `<year>-<task>_input.txt`. For example year 2022, task 01 would have input in `.cache/2022-1_input.txt`

### Automatic input download

For automatic download to work, you need to pass two ENV variables.

- `USER_AGENT` - can be anything, but it should identify you as a person. This is based on request of AoC author. Read more in [this reddit thread](https://www.reddit.com/r/adventofcode/comments/z9dhtd/please_include_your_contact_info_in_the_useragent/). You can use for example `AoC solver <your email>`.
- `SESSION` - this is your website session. This app does no authentication, so you have to authenticate in browser and then "steal" your own session. It should be valid for about a month.

You can use `.env` file to store the values. Just use `.env.sample` as a base. Do not commit `.env` file with your session!

## Running the tasks

Run task with

```
> npm run task <task number>
```

For example

```
> npm run task 01
```

Specific part of task can be run by

```
> npm run task 01-1
```

Different years can be run by providing year first. If year is omitted, current year is used.

```
> npm run task 2021-01-1
```
