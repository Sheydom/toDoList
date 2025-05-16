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

    // replace p with inputfield
    const paragraph = task.querySelector("p");
    let tasks = JSON.parse(localStorage.getItem("tasks") || []);
    const taskIndex = tasks.findIndex(
      (task) => task.text === paragraph.textContent
    );
    paragraph.replaceWith(editInputField);
    editInputField.focus();
    // save edited task when user press enter
    editInputField.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && editInputField.value.trim() !== "") {
        const newTaskText = editInputField.value.trim();
        paragraph.textContent = newTaskText;

        editInputField.replaceWith(paragraph);

        if (taskIndex !== -1) {
          tasks[taskIndex].text = paragraph.textContent;
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
      } else if (event.key === "Enter" && editInputField.value.trim() == "") {
        editInputField.replaceWith(paragraph);
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

// save data on actual server


//e2e test with cypress

