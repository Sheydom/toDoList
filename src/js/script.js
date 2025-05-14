const addButton = document.querySelector(".addTask__button");
const taskInput = document.querySelector(".addTask__input");
const taskList = document.querySelector(".taskList");
const clearAllButton = document.querySelector(".clearAll__button");
const statusCounter = document.querySelector(".status__counter");

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  counterTasks();
});

// function to add tasks
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }
  const newTask = document.createElement("div");
  newTask.classList.add("tasklist__task");
  newTask.innerHTML = `
  <div class="tasklist__all">
  <input type="checkbox" name="task" class="tasklist__checkbox" />
    <p>${taskText}</p>
    <span class="tasklist__edit"><i class="ri-edit-2-line"></i></span></div>
         <div class="delete">     <span class="tasklist__delete"> <i class="ri-delete-bin-6-line"></i></span></div>

    `;
  taskList.appendChild(newTask);
  saveTaskToLocalStorage(taskText);
  taskInput.value = "";
  counterTasks();
  return newTask;
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
    const task = event.target.closest(".tasklist__task");
    const taskText = task.querySelector("p").textContent;

    //create input field to edit task
    const editInputField = document.createElement("input");
    editInputField.type = "text";
    editInputField.value = taskText;
    editInputField.classList.add("edit__input");
    const paragraph = task.querySelector("p");
    paragraph.replaceWith(editInputField);
    editInputField.focus();
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
    const task = event.target.closest(".tasklist__task");
    const taskText = task.querySelector("p").textContent;
    deleteTask(taskText);
    task.remove();
    counterTasks();
  }
});

// save tasks to localstorage
function saveTaskToLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, checked: false });
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
  if (event.target.classList.contains("tasklist__checkbox")) {
    const task = event.target.closest(".tasklist__task");
    const taskText = task.querySelector("p").textContent;
    updateCheckedStatus(taskText, event.target.checked);
    counterTasks();
  }
});

// function to load tasks from localstorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const newTask = document.createElement("div");
    newTask.classList.add("tasklist__task");
    newTask.innerHTML = `
  <div class="tasklist__all">
  <input type="checkbox" name="task" class="tasklist__checkbox" ${task.checked ? "checked" : ""} />
    <p>${task.text}</p>
    <span class="tasklist__edit"><i class="ri-edit-2-line"></i></span></div>
         <div class="delete">     <span class="tasklist__delete"> <i class="ri-delete-bin-6-line"></i></span></div>

    `;
    taskList.appendChild(newTask);
  });
}
// clear all tasks function
function clearAllTasks() {
  localStorage.removeItem("tasks");
  taskList.innerHTML = "";
  counterTasks();
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
}


// still working on edit button 


//create modify task button and function
// script with gulp and test with cypress chai&mocha
//e2e test with cypress
// test suite with mocha and chai
