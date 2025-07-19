// const { task } = require("gulp");
import "../scss/base/styles.css"; // or .scss for webpack
import "./firebase.js"; // Import Firebase app
import { listenToAuthState } from "./auth_user.js";
import { logout } from "./auth_user.js";
import { fixOldTimestamps, loadSliderValueFromFirebase } from "./db.js";
import { saveSliderValueToFirebase } from "./db.js";

const h2Header = document.querySelector(".h2Header");
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
const loginForm = document.querySelector("#loginForm");
const resetButton = document.querySelector("#resetBtn");
const reset = document.querySelector(".reset");
const passDiv = document.querySelector(".passDiv");
const main = document.querySelector("main");
const addButton = document.querySelector(".addTask__button");
const taskInput = document.querySelector(".addTask__input");
const taskList = document.querySelector(".tasklist");

const clearAllButton = document.querySelector(".clearAll__button");
const statusCounter = document.querySelector(".status__counter");
const example = document.querySelector(".tasklist__task");
const slider = document.querySelector(".reminderSlider__sliderInput");
const rangeValue = document.querySelector(".rangeValue");
let sliderValue = parseInt(slider.value, 10);

document.addEventListener("DOMContentLoaded", async () => {
  await initializeSlider();
  await loadTasks();
  counterTasks();
  hideExample();
  warnOldest();
  // setInterval(warnOldest, 1000); // test slider value in seconds
  setInterval(warnOldest, 1000 * 60 * 60 * 12); // Check every 12 hours
});

async function initializeSlider() {
  const savedValue = await loadSliderValueFromFirebase();

  // Pick Firebase value or safe fallback
  sliderValue = savedValue !== null ? parseInt(savedValue, 10) : 3;

  // Set the slider's value before it's visible
  slider.value = sliderValue;

  // Update UI text
  rangeValue.innerText =
    sliderValue > 1 ? `in ${sliderValue} days` : `in ${sliderValue} day`;

  warnOldest();
}

//reset password ui
resetButton.addEventListener("click", () => {
  h2Header.innerText = "Reset Password";
  nameDiv.classList.add("hidden");
  nameDiv.required = false;
  loginButton.classList.add("hidden");
  switchCreateButton.classList.add("hidden");
  backToLoginButton.classList.remove("hidden");
  reset.classList.remove("hidden");
  resetButton.classList.add("hidden");
  passwordInput.classList.add("hidden");
  reset.setAttribute("type", "submit");
  passwordInput.required = false;
  createButton.classList.add("hidden");
  passDiv.classList.add("hidden");
});

//sign out function
logoutButton.addEventListener("click", async () => {
  try {
    await logout();
    backToLoginButton.classList.add("hidden");
    nameDiv.classList.add("hidden");
    nameInput.required = false;
    loginButton.classList.remove("hidden");
    createButton.classList.add("hidden");
    switchCreateButton.classList.remove("hidden");
    passwordInput.autocomplete = "current-password";
    messageText.innerText = "";
    message.classList.add("hidden");
    h2Header.innerText = "Login";
    reset.classList.add("hidden");
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
});

// login status check
listenToAuthState(async (user) => {
  if (user) {
    // ✅ User is logged in
    modal.classList.add("hidden");
    welcome.innerText = user.displayName ? `${user.displayName}'s` : "";
    message.classList.add("hidden");
    messageText.innerText = "";
    reset.classList.add("hidden");
    reset.setAttribute("type", "button");
    passwordInput.required = true;
    await loadTasks();
    await initializeSlider();
    hideExample();
    counterTasks();
    warnOldest();
    document.querySelector(".app").style.visibility = "visible";
  } else {
    // ❌ User is logged out
    modal.classList.remove("hidden");
    taskList.innerHTML = "";
    statusCounter.innerText = "0/0";
    document.querySelector(".app").style.visibility = "visible";
  }
});

backToLoginButton.addEventListener("click", () => {
  backToLoginButton.classList.add("hidden");
  nameDiv.classList.add("hidden");
  nameInput.required = false;
  loginButton.classList.remove("hidden");
  createButton.classList.add("hidden");
  switchCreateButton.classList.remove("hidden");
  passwordInput.autocomplete = "current-password";
  messageText.innerText = "";
  message.classList.add("hidden");
  h2Header.innerText = "Login";
  reset.classList.add("hidden");
  resetButton.classList.remove("hidden");
  passwordInput.classList.remove("hidden");
  reset.setAttribute("type", "button");
  passwordInput.required = true;
  passDiv.classList.remove("hidden");
});

// event listener for buttons so they trigger submit when clicked
loginButton.addEventListener("click", () => loginForm.requestSubmit());
createButton.addEventListener("click", () => loginForm.requestSubmit());
reset.addEventListener("click", () => loginForm.requestSubmit());

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // login mode for hit enter
  if (!loginButton.classList.contains("hidden")) {
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
      welcome.innerText = user.displayName
        ? `${user.displayName}'s`
        : "Welcome";
    } catch (error) {
      // const errorCode = error.code;
      const errorMessage = error.message;
      message.classList.remove("hidden");
      messageText.innerText = `Login failed: ${errorMessage}`;
    }
  } else if (
    !createButton.classList.contains("hidden") &&
    !backToLoginButton.classList.contains("hidden")
  ) {
    //create user mode for hit enter
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
      nameDiv.classList.remove("hidden");
      sliderValue = parseInt(slider.value, 10);
      rangeValue.innerText =
        sliderValue > 1 ? `in ${sliderValue} days` : `in ${sliderValue} day`;
      welcome.innerText = user.displayName
        ? `${user.displayName}'s`
        : "Welcome";
    } catch (error) {
      message.classList.remove("hidden");
      messageText.innerText = `Error: ${error.message}`;
    }
  } else if (!reset.classList.contains("hidden")) {
    try {
      const email = emailInput.value.trim();
      const { resetPassword } = await import("./db.js");
      if (!email) {
        alert("Please enter your email address.");
        return;
      }

      await resetPassword(email);

      message.classList.remove("hidden");
      messageText.innerText = "Email to reset password sent";
      message.classList.add("messageGreen");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
});

switchCreateButton.addEventListener("click", () => {
  nameDiv.classList.remove("hidden");
  nameInput.required = true;
  loginButton.classList.add("hidden");
  switchCreateButton.classList.add("hidden");
  createButton.classList.remove("hidden");
  backToLoginButton.classList.remove("hidden");
  passwordInput.autocomplete = "new-password";
  emailInput.autocomplete = "";
  h2Header.innerText = "New Account";
  reset.classList.add("hidden");
  passDiv.classList.remove("hidden");
});

slider.addEventListener("input", () => {
  sliderValue = parseInt(slider.value, 10);
  rangeValue.innerText =
    sliderValue > 1 ? `in ${sliderValue} days` : `in ${sliderValue} day`;
  warnOldest();
  saveSliderValueToFirebase(sliderValue);
});

// function to add tasks
async function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  await saveTaskToFirestore(taskText);
  taskInput.value = "";
  await loadTasks();
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
    const oldParagraph = newTask.querySelector("p");
    const oldText = oldParagraph.textContent;
    const checkbox = newTask.querySelector(".tasklist__checkbox");
    const taskId = checkbox.dataset.id;

    // Create input field to edit task
    const editInputField = document.createElement("textarea");
    editInputField.classList.add("edit__input");
    editInputField.value = oldText;
    editInputField.style.minWidth = `${oldParagraph.offsetWidth}px`;
    editInputField.style.height = `${oldParagraph.offsetHeight}+2px`;
    oldParagraph.replaceWith(editInputField);
    editInputField.focus();

    let isSaving = false;

    //save edit function
    async function saveEdit() {
      //prevent double saving
      if (isSaving) return;
      isSaving = true;
      const updatedText = editInputField.value.trim();
      if (updatedText !== "") {
        const { updateTask } = await import("./db.js");
        await updateTask(taskId, { text: updatedText });
        await loadTasks();
        await warnOldest();
        await counterTasks();
      } else {
        // If empty, revert to old paragraph
        editInputField.replaceWith(oldParagraph);
      }
    }

    // Save edited task when user presses Enter
    editInputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveEdit();
      }
    });
    //when you click outside the input field, save the edit

    editInputField.addEventListener("blur", () => saveEdit());
  }
});

//add calenderDate
taskList.addEventListener("click", async (event) => {
  const calender = event.target.closest(".tasklist__calender");
  if (!calender) return;

  let dateInput = calender.nextElementSibling;

  // If input doesn't exist, create it
  if (!dateInput || !dateInput.classList.contains("calenderInput")) {
    dateInput = document.createElement("input");
    dateInput.type = "text";
    dateInput.classList.add("calenderInput");
    calender.after(dateInput);

    // ✅ Lazy load Flatpickr + CSS only when needed
    const [{ default: flatpickr }, _] = await Promise.all([
      import("flatpickr"),
      import("flatpickr/dist/flatpickr.min.css"),
    ]);

    const fp = flatpickr(dateInput, {
      defaultDate: "today",
      dateFormat: "Y-m-d",
      onClose: () => {
        instance.input.remove();
      },
      onChange: () => {
        instance.input.remove();
      },
    });

    fp.open();
  } else {
    if (dateInput._flatpickr) {
      dateInput._flatpickr.open();
    }
  }
});

//delete function to remove task from firebase
async function deleteTask(taskID) {
  const { deleteTask } = await import("./db.js");
  await deleteTask(taskID);
  counterTasks();
  warnOldest();
}

//event listener to delete Tasks from tasklist
taskList.addEventListener("click", (event) => {
  if (event.target.closest(".tasklist__delete")) {
    const task = event.target.closest(".tasklist__newTask");
    const taskId = task.querySelector(".tasklist__checkbox").dataset.id;
    deleteTask(taskId);
    loadTasks();
    counterTasks();
  }
});

// save tasks to firebase
async function saveTaskToFirestore(taskText) {
  const { addTask } = await import("./db.js");
  await addTask(taskText); // oas the taskt text
}

// update checked status
async function updateCheckedStatus(taskID, isChecked) {
  const { updateTask } = await import("./db.js");
  await updateTask(taskID, { checked: isChecked });
}

//tasklist eventlistener for change of checkbox
taskList.addEventListener("change", (event) => {
  if (event.target.classList.contains("tasklist__checkbox")) {
    const task = event.target.closest(".tasklist__newTask");
    const taskID = task.querySelector(".tasklist__checkbox").dataset.id;
    updateCheckedStatus(taskID, event.target.checked);
    counterTasks();
    warnOldest();
  }
});

// function to load tasks from firebase
async function loadTasks() {
  const { loadTask } = await import("./db.js");
  const tasks = await loadTask();
  if (!Array.isArray(tasks)) return;

  // clear task list before adding new one
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const newTask = document.createElement("div");

    const timeStamp = task.timestamp;
    let displayDate = "";
    if (timeStamp?.toDate) {
      displayDate = timeStamp.toDate().toLocaleDateString();
    } else if (typeof timeStamp === "string") {
      displayDate = new Date(timeStamp).toLocaleDateString();
    }

    // newTask.classList.add("tasklist__task");
    newTask.classList.add("tasklist__newTask");
    newTask.innerHTML = `
  <div class="tasklist__all">
    <input data-id="${task.id}" type="checkbox" name="task" class="tasklist__checkbox" ${task.checked ? "checked" : ""} />
    <p>${task.text}</p>
    
    <span ><span class="tasklist__timestamp">${displayDate}</span><i class="ri-edit-2-line tasklist__edit"></i></span><span><i class="ri-calendar-schedule-line tasklist__calender"></i></span></div>
         <div class="delete"><span class="tasklist__delete"> <i class="ri-delete-bin-6-line "></i></span></div>

    `;
    taskList.appendChild(newTask);
  });
}
// clear all tasks function
async function clearAllTasks() {
  const { clearTasks } = await import("./db.js");
  await clearTasks();
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
async function counterTasks() {
  const { loadTask } = await import("./db.js");
  const tasks = await loadTask();
  if (!Array.isArray(tasks)) {
    statusCounter.innerText = `0/0`;
    hideExample();
    return;
  }
  const counter = tasks.length;
  const checkCounter = document.querySelectorAll(".tasklist__checkbox");
  const newtask = document.querySelectorAll(".tasklist__newTask");

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

async function hideExample() {
  const { loadTask } = await import("./db.js");
  const tasks = await loadTask();
  if (!Array.isArray(tasks)) return;
  const tasksLength = tasks.length;
  if (tasksLength === 0) {
    example.classList.add("show");
  } else {
    example.classList.remove("show");
  }
}

async function warnOldest() {
  const { loadTask, loadSliderValueFromFirebase } = await import("./db.js");

  const [tasks, sliderValue] = await Promise.all([
    loadTask(),
    loadSliderValueFromFirebase(),
  ]);

  if (!Array.isArray(tasks) || tasks.length === 0) return;

  tasks.forEach((task) => {
    let createdAt;

    if (task.timestamp?.toDate) {
      createdAt = task.timestamp.toDate(); // Firestore Timestamp
    } else if (typeof task.timestamp === "string") {
      createdAt = new Date(task.timestamp); // old string fallback
    } else {
      return; // skip this task
    }

    if (!createdAt) return;

    const ageInMs = Date.now() - createdAt.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

    const taskElement = document
      .querySelector(`input.tasklist__checkbox[data-id="${task.id}"]`)
      ?.closest(".tasklist__newTask")
      ?.querySelector("p");

    if (ageInDays >= sliderValue) {
      if (taskElement) {
        taskElement.classList.add("tasklist__oldestTask");
        taskElement
          .closest(".tasklist__all")
          .classList.add("tasklist__oldestTask");
      }
    } else if (taskElement) {
      taskElement.classList.remove("tasklist__oldestTask");
      taskElement
        .closest(".tasklist__all")
        ?.classList.remove("tasklist__oldestTask");
    }
  });
}
