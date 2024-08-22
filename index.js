const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'tasks.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const printTasks = () => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const tasks = data.trim().split('\n');
    if (tasks.length === 0 || (tasks.length === 1 && tasks[0] === '')) {
      console.log('No tasks found.');
    } else {
      tasks.forEach((task, index) => {
        const [status, ...description] = task.split(' ');
        console.log(`${index + 1}. [${status}] ${description.join(' ')}`);
      });
    }
    promptUser();
  });
};

const addTask = (task) => {
  fs.appendFile(filePath, `INCOMPLETE ${task}\n`, (err) => {
    if (err) throw err;
    console.log('Task added.');
    promptUser();
  });
};

const markTaskComplete = (index) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    let tasks = data.trim().split('\n');
    if (index < 1 || index > tasks.length) {
      console.log('Invalid task number.');
      promptUser();
      return;
    }
    tasks[index - 1] = tasks[index - 1].replace('INCOMPLETE', 'COMPLETE');
    fs.writeFile(filePath, tasks.join('\n') + '\n', (err) => {
      if (err) throw err;
      console.log('Task marked as complete.');
      promptUser();
    });
  });
};

const removeTask = (index) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    let tasks = data.trim().split('\n');
    if (index < 1 || index > tasks.length) {
      console.log('Invalid task number.');
      promptUser();
      return;
    }
    tasks.splice(index - 1, 1);
    fs.writeFile(filePath, tasks.join('\n') + '\n', (err) => {
      if (err) throw err;
      console.log('Task removed.');
      promptUser();
    });
  });
};

const promptUser = () => {
  rl.question('Choose an action: \n1. Add Task\n2. View Tasks\n3. Mark Task Complete\n4. Remove Task\n5. Exit\n', (choice) => {
    switch (choice.trim()) {
      case '1':
        rl.question('Enter task description: ', (task) => {
          addTask(task);
        });
        break;
      case '2':
        printTasks();
        break;
      case '3':
        rl.question('Enter task number to mark complete: ', (num) => {
          markTaskComplete(parseInt(num));
        });
        break;
      case '4':
        rl.question('Enter task number to remove: ', (num) => {
          removeTask(parseInt(num));
        });
        break;
      case '5':
        console.log('Exiting...');
        rl.close();
        break;
      default:
        console.log('Invalid choice.');
        promptUser();
        break;
    }
  });
};

console.log('Task Manager');
promptUser();
