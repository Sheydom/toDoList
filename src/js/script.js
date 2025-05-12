const addButton = document.querySelector(".addTask__button");
const taskInput = document.querySelector(".addTask__input");
const taskList = document.querySelector(".taskList");
const clearAllButton = document.querySelector(".clearAll__button");

document.addEventListener("DOMContentLoaded", loadTasks);

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

//event listener to delete Tasks from tasklist
taskList.addEventListener("click", (event) => {
  if (event.target.closest(".tasklist__delete")) {
    const task = event.target.closest(".tasklist__task");
    const taskText = task.querySelector("p").textContent;
    deleteTask(taskText);
    task.remove();
  }
});

//function to save tasks to localstorage
function saveTaskToLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// function to load tasks from localstorage
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskText) => {
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
  });
}

function clearAllTasks() {
  localStorage.removeItem("tasks");
  taskList.innerHTML = "";
}

clearAllButton.addEventListener("click", () => {
  clearAllTasks();
});

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//update function in case you have two of the same tasks to it will be only one deleted not all at once when clickign on one to be deleted
//update counter and counting bar
//create modify task button and function
