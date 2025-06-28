// const { task } = require("gulp");
import "../scss/base/styles.css"; // or .scss for webpack
import "./firebase.js"; // Import Firebase app
import { listenToAuthState } from "./auth_user.js";
import { logout } from "./auth_user.js";

const modal = document.querySelector(".modal");
const loginButton = document.querySelector(".loginButton");
const createButton = document.querySelector(".createButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const nameDiv = document.querySelector(".nameDiv");
const message = document.querySelector(".message");
const messageText = document.querySelector(".messageText");
const switchCreateButton = document.querySelector(".switchCreateButton");
const welcome = document.querySelector(".welcome");
const logoutButton = document.querySelector(".logoutButton");
const backToLoginButton = document.querySelector(".backToLoginButton");

//sign out function
logoutButton.addEventListener("click", async () => {
  try {
    await logout();
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
});

// login status check
listenToAuthState((user) => {
  if (user) {
    // ✅ User is logged in
    modal.classList.add("hidden");
  } else {
    // ❌ User is logged out
    modal.classList.remove("hidden");
  }
});

backToLoginButton.addEventListener("click", () => {
  backToLoginButton.classList.add("hidden");
  nameDiv.classList.add("hidden");
  nameInput.required = false;
  loginButton.classList.remove("hidden");
  createButton.classList.add("hidden");
  switchCreateButton.classList.remove("hidden");
});

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const { login } = await import("./auth_user.js");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (email === "" || password === "") {
    message.classList.remove("hidden");
    messageText.innerText = "Pleasse fill in all fields";
    return;
  }
  try {
    const userCredential = await login(email, password);
    const user = userCredential.user;
    modal.classList.add("hidden");
    welcome.innerText = `${user.displayName}'s`;
  } catch (error) {
    // const errorCode = error.code;
    const errorMessage = error.message;
    message.classList.remove("hidden");
    messageText.innerText = `Login failed: ${errorMessage}`;
  }
});

switchCreateButton.addEventListener("click", () => {
  nameDiv.classList.remove("hidden");
  nameInput.required = true;
  loginButton.classList.add("hidden");
  switchCreateButton.classList.add("hidden");
  createButton.classList.remove("hidden");
  backToLoginButton.classList.remove("hidden");
});

createButton.addEventListener("click", async () => {
  const { createUser } = await import("./auth_user.js");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (email === "" || password === "" || name === "") {
    message.classList.remove("hidden");
    messageText.innerText = "Please fill in all fields";
    return;
  }

  try {
    const userCredential = await createUser(email, password, name);
    const user = userCredential.user;
    message.classList.remove("hidden");
    messageText.innerText = `Welcome, ${user.displayName}`;
    message.classList.add("messageGreen");
    nameDiv.classList.add("hidden");
    loginButton.classList.remove("hidden");
    switchCreateButton.classList.add("hidden");
  } catch (error) {
    message.classList.remove("hidden");
    messageText.innerText = `Error: ${error.message}`;
  }
});

const main = document.querySelector("main");
const addButton = document.querySelector(".addTask__button");
const taskInput = document.querySelector(".addTask__input");
const taskList = document.querySelector(".tasklist");

const clearAllButton = document.querySelector(".clearAll__button");
const statusCounter = document.querySelector(".status__counter");
const example = document.querySelector(".tasklist__task");
const slider = document.querySelector(".reminderSlider__sliderInput");
const rangeValue = document.querySelector(".rangeValue");
let sliderValue = slider.value;

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  counterTasks();
  hideExample();
  loadRangeValue();
  warnOldest();
  // setInterval(warnOldest, 1000); // test slider value in seconds
  setInterval(warnOldest, 1000 * 60 * 60 * 12); // Check every 12 hours
});

slider.addEventListener("input", () => {
  sliderValue = slider.value;
  rangeValue.innerText =
    sliderValue > 1 ? `in ${sliderValue} days` : `in ${sliderValue} day`;
  saveRangeValue(sliderValue);
  warnOldest();
});

function saveRangeValue(sliderValue) {
  localStorage.setItem("sliderValue", sliderValue);
}

function loadRangeValue() {
  const savedValue = localStorage.getItem("sliderValue");

  if (savedValue) {
    slider.value = savedValue;
    rangeValue.innerText =
      savedValue > 1 ? `in ${savedValue} days` : `in ${savedValue} day`;
    // rangeValue.innerText = `in ${savedValue} days`;
    sliderValue = parseInt(savedValue, 10);
  }
}

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
    
   <span ><span class="tasklist__timestamp">${displayDate}</span><i class="ri-edit-2-line tasklist__edit"></i></span></div>
         <div class="delete">     <span class="tasklist__delete"> <i class="ri-delete-bin-6-line "></i></span></div>
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
    const newTask = event.target.closest(".tasklist__newTask");

    const newTaskText = newTask.querySelector("p").textContent;

    //create input field to edit task
    const editInputField = document.createElement("input");
    editInputField.type = "text";
    editInputField.value = newTaskText;
    editInputField.classList.add("edit__input");

    const newParagraph = newTask.querySelector("p");
    let tasks = JSON.parse(localStorage.getItem("tasks") || []);
    const taskIndex = tasks.findIndex(
      (task) => task.text === newParagraph.textContent
    );

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
  if (event.target.classList.contains("tasklist__checkbox")) {
    const task = event.target.closest(".tasklist__newTask");
    const taskText = task.querySelector("p").textContent;
    updateCheckedStatus(taskText, event.target.checked);
    counterTasks();
    warnOldest();
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
    
    <span ><span class="tasklist__timestamp">${displayDate}</span><i class="ri-edit-2-line tasklist__edit"></i></span></div>
         <div class="delete">     <span class="tasklist__delete"> <i class="ri-delete-bin-6-line "></i></span></div>
         

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
  const newtask = document.querySelectorAll(".tasklist__newTask");

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

    newtask.forEach((task) => {
      const inner = task.querySelector(".tasklist__all");
      const innerP = task.querySelector("p");
      inner.classList.remove("tasklist__oldestTask");
      inner.classList.add("tasklist__checkedTask");
      innerP.classList.remove("tasklist__oldestTask");
      innerP.classList.add("tasklist__checked");
    });
  } else {
    statusCounter.classList.remove("allChecked");
    main.classList.remove("mainChecked");
    newtask.forEach((task) => {
      const inner = task.querySelector(".tasklist__all");
      const innerP = task.querySelector("p");
      innerP.classList.remove("tasklist__checked");
      inner.classList.remove("tasklist__checkedTask");
    });
  }

  if (checkedTasks > 0) {
    checkCounter.forEach((checkbox) => {
      if (checkbox.checked) {
        const task = checkbox.closest(".tasklist__newTask");
        const inner = task.querySelector(".tasklist__all");
        const innerP = task.querySelector("p");
        inner.classList.remove("tasklist__oldestTask");
        inner.classList.add("tasklist__checkedTask");
        innerP.classList.remove("tasklist__oldestTask");
        innerP.classList.add("tasklist__checked");
      }
    });
  } else {
    statusCounter.classList.remove("allChecked");
    main.classList.remove("mainChecked");
    newtask.forEach((task) => {
      const inner = task.querySelector(".tasklist__all");
      const innerP = task.querySelector("p");
      innerP.classList.remove("tasklist__checked");
      inner.classList.remove("tasklist__checkedTask");
    });
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
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      const today = new Date();
      const taskDate = new Date(task.timestamp);
      const taskDiffTime = Math.abs(today - taskDate);
      const taskDiffDays = Math.floor(taskDiffTime / (1000 * 60 * 60 * 24)); //floor better than ceil because it rounds up i needs to be a full day 4,1 = 4 and not 5

      const taskElement = Array.from(document.querySelectorAll("p")).find(
        (p) => task.text === p.textContent
      );
      if (taskDiffDays >= sliderValue) {
        if (taskElement) {
          taskElement.classList.add("tasklist__oldestTask");
          taskElement
            .closest(".tasklist__all")
            .classList.add("tasklist__oldestTask");
        }
      } else {
        taskElement.classList.remove("tasklist__oldestTask");
        taskElement
          .closest(".tasklist__all")
          .classList.remove("tasklist__oldestTask");
      }
    });
  }
}
