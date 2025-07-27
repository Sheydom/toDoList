// const { task } = require("gulp");
import "../scss/base/styles.css"; // or .scss for webpack
import "./firebase.js"; // Import Firebase app
import { listenToAuthState } from "./auth_user.js";
import { logout } from "./auth_user.js";

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

document.addEventListener("DOMContentLoaded", async () => {
  await loadTasks();

  counterTasks();
  hideExample();
  setInterval(loadTasks, 1000 * 60 * 60 * 12); // Check every 12 hours
});

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

    // Load tasks and initialize UI features
    try {
      await loadTasks();
      hideExample();
      counterTasks();
      const { saveEmail } = await import("./db.js");
      saveEmail();
    } catch (err) {
      console.error("❌ Initialization failed:", err.message);
    }

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

// function to add tasks
async function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const deadlineInputs = document.querySelectorAll(".calenderInput");
  let deadlineValue = null;
  if (deadlineInputs.length > 0) {
    const value = deadlineInputs[0].value;
    if (value) deadlineValue = new Date(value);
  }

  await saveTaskToFirestore(taskText, deadlineValue);
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
      dateFormat: "d/m/Y", // ✅ shows 25/07/2025
      disableMobile: true,
      position: "auto center",
      onChange: async (selectedDates) => {
        const selectedDate = selectedDates[0];

        const taskElement = calender.closest(".tasklist__newTask");
        const taskID = taskElement?.querySelector(".tasklist__checkbox")
          ?.dataset.id;

        if (taskID && selectedDate) {
          const { updateTask } = await import("./db.js");
          await updateTask(taskID, { deadline: selectedDate });
          await loadTasks();
        }
      },

      onClose: () => {
        // fp.destroy();
        fp.input.remove();
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
async function saveTaskToFirestore(taskText, deadlineValue) {
  const { addTask } = await import("./db.js");
  await addTask(taskText, deadlineValue); // oas the taskt text
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
  }
});

// function to load tasks from firebase
async function loadTasks() {
  const { loadTask } = await import("./db.js");
  const tasks = await loadTask();
  if (!Array.isArray(tasks)) return;
  taskList.innerHTML = "";
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  tasks.forEach((task) => {
    const newTask = document.createElement("div");

    // ✅ Creation Date
    let creationDate = "";
    if (task.timestamp?.toDate) {
      creationDate = new Intl.DateTimeFormat("en-AU").format(
        task.timestamp.toDate()
      );
    } else if (typeof task.timestamp === "string") {
      creationDate = new Intl.DateTimeFormat("en-AU").format(
        new Date(task.timestamp)
      );
    }

    // ✅ Deadline Calculation
    let deadlineDisplay = "No due Date";
    let isOverdue = false;
    let isToday = false;

    if (task.deadline) {
      const dateObj = task.deadline.toDate
        ? task.deadline.toDate()
        : new Date(task.deadline);
      const options = { day: "2-digit", month: "short" };
      const formattedDate = new Intl.DateTimeFormat("en-AU", options).format(
        dateObj
      );

      dateObj.setHours(0, 0, 0, 0);
      const oneDay = 1000 * 60 * 60 * 24;
      const diff = Math.ceil((dateObj - today) / oneDay);

      if (diff >= 2) {
        deadlineDisplay = `Due in ${diff} day${diff === 1 ? "" : "s"} <br> ${formattedDate}`;
      } else if (diff === 1) {
        deadlineDisplay = `Due Tomorrow <br>  ${formattedDate}`;
      } else if (diff === 0) {
        deadlineDisplay = `Due Today <br> ${formattedDate}`;
        isToday = true;
      } else {
        deadlineDisplay = `Overdue by <br> ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"}`;
        isOverdue = true;
        isToday = false;
      }
    }

    // ✅ Render
    newTask.classList.add("tasklist__newTask");
    newTask.innerHTML = `
      <div class="tasklist__all ${isOverdue ? "tasklist__oldestTask" : ""}${isToday ? "tasklist__todayTask" : ""}">

      <div class="tasklist__optionsDiv1">
        <input data-id="${task.id}" type="checkbox" name="task" class="tasklist__checkbox" ${task.checked ? "checked" : ""} />
        <p class="${isOverdue ? "tasklist__oldestTask" : ""}">${task.text}</p>
        </div>
       <div class="tasklist__optionsDiv">
        <span class="tasklist__deadlineDays">
          <i class="ri-edit-2-line tasklist__edit" title="Edit task text"></i>
                    <i class="ri-calendar-schedule-line tasklist__calender" title="Set deadline"></i>
                    
        </span>
          <span class="tasklist__deadline">${deadlineDisplay}</span>
        </div>
      </div>
      <div class="delete">
        <span class="tasklist__delete" title="Delete task">
          <i class="ri-delete-bin-6-line"></i>
        </span>
      </div>
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
