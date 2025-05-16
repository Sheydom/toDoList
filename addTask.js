function addTask(taskList, taskInput, saveTaskToLocalStorage, counterTasks) {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    return null;
  }
  const newTask = taskInput.ownerDocument.createElement("div");
  newTask.classList.add("tasklist__task");
  newTask.innerHTML = `
    <div class="tasklist__all">
      <input type="checkbox" name="task" class="tasklist__checkbox" />
      <p>${taskText}</p>
      <span class="tasklist__edit"><i class="ri-edit-2-line"></i></span>
    </div>
    <div class="delete">
      <span class="tasklist__delete"><i class="ri-delete-bin-6-line"></i></span>
    </div>
  `;
  taskList.appendChild(newTask);
  if (saveTaskToLocalStorage) saveTaskToLocalStorage(taskText);
  if (counterTasks) counterTasks();
  taskInput.value = "";
  return newTask;
}

export{addTask};