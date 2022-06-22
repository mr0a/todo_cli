const fs = require("fs")

let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

const [args, command] = [process.argv, process.argv[2]]

let options = { add, del, done, help, ls, report }
command in options ? options[command]() : help()

/* Utilities */

function getTaskList(filename) {
  // Retrieve tasks from file and send list of tasks
  let data = ''
  try {
    data = fs.readFileSync(filename, { encoding: 'utf-8' })
  } catch (err) {
    return []
  }
  let tasks = data.trim().split('\n')
  tasks = tasks.filter(Boolean) // Remove Empty Strings
  return tasks
}

function getSortedTasks(tasks) {
  // Sort tasks based on given priority
  return tasks
    .map(task =>
      task
        .split("-p-"))
    .sort((a, b) => {
      return Number(a[1]) > Number(b[1]) ? 1 : -1
    })
}

function removeAndRewrite(taskIndex, tasks) {
  // Remove particular task and rewrite others tasks in file
  tasks = tasks.filter((task, index) => index !== Number(taskIndex - 1))
  let output = ''
  tasks.forEach(task => {
    output += `${task[0]}-p-${task[1]}\n`
  })
  fs.writeFileSync("task.txt", output)
}

function printTasks(tasks) {
  let output = ''
  tasks.forEach((task, index) => {
    output = output +
      (typeof (task) === "string" ?
        `${index + 1}. ${task}\n` :
        `${index + 1}. ${task[0]} [${task[1]}]\n`)
  })
  process.stdout.write(output)
}


/* Features */
function add() {
  if (args.length < 4) {
    return process.stdout.write("Error: Missing tasks string. Nothing added!")
  }
  const [task, priority] = args.length === 5 ? [args[4], Number(args[3])] : [args[3], 0]
  fs.appendFileSync("task.txt", `${task}-p-${priority}\n`)
  process.stdout.write(`Added task: "${task}" with priority ${priority}`)
}

function ls() {

  let tasks = getSortedTasks(getTaskList('task.txt'))
  if (tasks.length == 0)
    return process.stdout.write("There are no pending tasks!")
  printTasks(tasks)
}

function del() {
  let taskIndex = Number(args[3])
  if (args.length < 4 || isNaN(taskIndex))
    return process.stdout.write("Error: Missing NUMBER for deleting tasks.\n")
  let tasks = getSortedTasks(getTaskList('task.txt'))
  if (taskIndex < 1 || taskIndex > tasks.length) {
    return process.stdout.write(`Error: task with index #${taskIndex} does not exist. Nothing deleted.`)
  }
  removeAndRewrite(taskIndex, tasks)
  return process.stdout.write(`Deleted task #${taskIndex}`)
}

function done() {
  const taskIndex = Number(args[3])
  if (args.length < 4 || isNaN(taskIndex))
    return process.stdout.write("Error: Missing NUMBER for marking tasks as done.\n")
  let tasks = getSortedTasks(getTaskList('task.txt'))
  if (taskIndex < 1 || taskIndex > tasks.length)
    return process.stdout.write(`Error: no incomplete item with index #${taskIndex} exists.\n`)

  removeAndRewrite(taskIndex, tasks)
  tasks = tasks.filter((task, index) => index === Number(taskIndex - 1))
  let output = ""
  tasks.forEach(task => {
    output += `${task[0]}\n`
  })
  fs.appendFileSync("completed.txt", output)
  return process.stdout.write("Marked item as done.\n")
}

function help() {
  process.stdout.write(usage)
}

function report() {
  const pendingTasks = getSortedTasks(getTaskList("task.txt"))
  process.stdout.write(`Pending : ${pendingTasks.length}\n`)
  printTasks(pendingTasks)
  const completedTasks = getTaskList("completed.txt")
  process.stdout.write(`\nCompleted : ${completedTasks.length}\n`)
  printTasks(completedTasks)
}


/**********/