const addButton = document.querySelector(".addTask__button");
const taskInput = document.querySelector(".addTask__input");
const taskList = document.querySelector(".taskList");

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }
  const newTask = document.createElement("div");
  newTask.classList.add("tasklist__task");
  newTask.innerHTML = `<input type="checkbox" name="task" class="tasklist__checkbox" />
    <p>${taskText}</p>
    <span class="tasklist__edit"><i class="ri-edit-2-line"></i></span>
              <span class="tasklist__delete"> <i class="ri-delete-bin-6-line"></i></span>

    `;
  taskList.appendChild(newTask);
  taskInput.value = "";
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && taskInput.value.trim() !== "") {
    addTask();
  } else if (event.key === "Enter" && taskInput.value.trim() === "") {
    alert("Please enter a task.");
  }
});
