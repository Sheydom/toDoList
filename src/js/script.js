// const { task } = require("gulp");
const main = document.querySelector("main");
const addButton = document.querySelector(".addTask__button");
const taskInput = document.querySelector(".addTask__input");
const taskList = document.querySelector(".tasklist");

const clearAllButton = document.querySelector(".clearAll__button");
const statusCounter = document.querySelector(".status__counter");
const example = document.querySelector(".tasklist__task");

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  counterTasks();
  hideExample();
  warnOldest();
  // setInterval(warnOldest, 2000); // Check every 2seconds
  setInterval(warnOldest, 1000 * 60 * 60 * 12); // Check every 12 hours
});

// function to add tasks
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }
  const newTask = document.createElement("div");
  newTask.classList.add("tasklist__newTask");
  const timeStamp = new Date().toISOString();
  const displayDate = new Date(timeStamp).toLocaleDateString();
  newTask.innerHTML = `
  <div class="tasklist__all">
  <input type="checkbox" name="task" class="tasklist__checkbox" />
    <p>${taskText}</p>
    <span class="tasklist__timestamp">${displayDate}</span>
    <span class="tasklist__edit"><i class="ri-edit-2-line"></i></span></div>
         <div class="delete">     <span class="tasklist__delete"> <i class="ri-delete-bin-6-line"></i></span></div>

    `;
  taskList.appendChild(newTask);
  saveTaskToLocalStorage(taskText);
  taskInput.value = "";
  counterTasks();
}

// Eventlistener to add task to the tasklist
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && taskInput.value.trim() !== "") {
    addTask();
  } else if (event.key === "Enter" && taskInput.value.trim() === "") {
    alert("Please enter a task.");
  }
});

//event listener to edit task
taskList.addEventListener("click", (event) => {
  if (event.target.closest(".tasklist__edit")) {
    // const task = event.target.closest(".tasklist__task");
    const newTask = event.target.closest(".tasklist__newTask");
    // const taskText = task.querySelector("p").textContent;
    const newTaskText = newTask.querySelector("p").textContent;

    //create input field to edit task
    const editInputField = document.createElement("input");
    editInputField.type = "text";
    editInputField.value = newTaskText;
    editInputField.classList.add("edit__input");

    // replace p with inputfield
    // const paragraph = task.querySelector("p");
    const newParagraph = newTask.querySelector("p");
    let tasks = JSON.parse(localStorage.getItem("tasks") || []);
    const taskIndex = tasks.findIndex(
      (task) =>
        // task.text === paragraph.textContent ||
        task.text === newParagraph.textContent
    );
    // paragraph.replaceWith(editInputField);
    newParagraph.replaceWith(editInputField);
    editInputField.focus();
    // save edited task when user press enter
    editInputField.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && editInputField.value.trim() !== "") {
        const newTaskText = editInputField.value.trim();
        newParagraph.textContent = newTaskText;

        editInputField.replaceWith(newParagraph);

        if (taskIndex !== -1) {
          tasks[taskIndex].text = newParagraph.textContent;
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
      } else if (event.key === "Enter" && editInputField.value.trim() == "") {
        editInputField.replaceWith(newParagraph);
      }
    });
  }
});

//delete function to remove task from localstorage
function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.text === taskText);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  counterTasks();
}

//event listener to delete Tasks from tasklist
taskList.addEventListener("click", (event) => {
  if (event.target.closest(".tasklist__delete")) {
    const task = event.target.closest(".tasklist__newTask");
    const taskText = task.querySelector("p").textContent;
    deleteTask(taskText);
    task.remove();
    counterTasks();
  }
});

// save tasks to localstorage
function saveTaskToLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({
    text: taskText,
    checked: false,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// update checked status
function updateCheckedStatus(taskText, isChecked) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.text === taskText);
  if (taskIndex !== -1) {
    tasks[taskIndex].checked = isChecked;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//tasklist eventlistener for change of checkbox
taskList.addEventListener("change", (event) => {
  if (event.target.classList.contains("tasklist__newTask")) {
    const task = event.target.closest(".tasklist__newTask");
    const taskText = task.querySelector("p").textContent;
    updateCheckedStatus(taskText, event.target.checked);
    counterTasks();
  }
});

// function to load tasks from localstorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // tasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  tasks.forEach((task) => {
    const newTask = document.createElement("div");
    const timeStamp = task.timestamp;
    const displayDate = new Date(timeStamp).toLocaleDateString();
    // newTask.classList.add("tasklist__task");
    newTask.classList.add("tasklist__newTask");
    newTask.innerHTML = `
  <div class="tasklist__all">
  <input type="checkbox" name="task" class="tasklist__checkbox" ${task.checked ? "checked" : ""} />
    <p>${task.text}</p>
    
    <span class="tasklist__edit"><span class="tasklist__timestamp">${displayDate}</span><i class="ri-edit-2-line"></i></span></div>
         <div class="delete">     <span class="tasklist__delete"> <i class="ri-delete-bin-6-line"></i></span></div>
         

    `;
    taskList.appendChild(newTask);
  });
}
// clear all tasks function
function clearAllTasks() {
  localStorage.removeItem("tasks");
  // Remove all task elements
  document
    .querySelectorAll(".tasklist__newTask")
    .forEach((task) => task.remove());
  counterTasks();
  hideExample();
}

clearAllButton.addEventListener("click", () => {
  clearAllTasks();
  counterTasks();
});

// function to count tasks
function counterTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const counter = tasks.length;
  const checkCounter = document.querySelectorAll(".tasklist__checkbox");

  checkCounter.forEach((checkbox) => {
    checkbox.addEventListener("click", counterTasks);
  });

  const checkedTasks = Array.from(checkCounter).filter(
    (checkbox) => checkbox.checked
  ).length;
  statusCounter.innerText = `${checkedTasks}/${counter}`;
  hideExample();

  if (counter == checkedTasks && checkedTasks > 0) {
    statusCounter.classList.add("allChecked");
    main.classList.add("mainChecked");
  } else {
    statusCounter.classList.remove("allChecked");
    main.classList.remove("mainChecked");
  }
}

function hideExample() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const tasksLength = tasks.length;
  if (tasksLength === 0) {
    example.classList.add("show");
  } else {
    example.classList.remove("show");
  }
}

function warnOldest() {
  const AllP = document.querySelectorAll("p");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.length > 0) {
    const oldestTask = tasks.reduce((oldest, current) => {
      // return new Date(oldest.timestamp) < new Date(current.timestamp)
      return new Date(oldest.timestamp) < new Date(current.timestamp)
        ? oldest
        : current;
    });
    console.log(oldestTask.text);

    const arrayFromP = Array.from(AllP);

    console.log(arrayFromP);
    const oldestTaskIndex = arrayFromP.findIndex(
      (p) => p.textContent === oldestTask.text
    );
    console.log(oldestTaskIndex, "test");

    if (oldestTaskIndex !== -1) {
      AllP[oldestTaskIndex].classList.add("tasklist__oldestTask");
    }

    tasks.forEach((task) => {
      const today = new Date();
      const taskDate = new Date(task.timestamp);
      const taskDiffTime = Math.abs(today - taskDate);
      const taskDiffDays = Math.ceil(taskDiffTime / (1000 * 60 * 60 * 24));
      const taskElement = Array.from(document.querySelectorAll("p")).find(
        (p) => task.text === p.textContent
      );
      if (taskDiffDays > 2) {
        console.log(taskElement, "taskElement");
        if (taskElement) {
          taskElement.classList.add("tasklist__oldestTask");
        }
      } else {
        taskElement.classList.remove("tasklist__oldestTask");
      }
    });
  }
}

// save data on actual server

//e2e test with cypress
