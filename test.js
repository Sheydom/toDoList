import { expect } from "chai";
import { JSDOM } from "jsdom";
import { addTask } from "./addTask.js";

describe("addTask", () => {
  let window, document, taskList, taskInput;

  beforeEach(() => {
    const dom = new JSDOM(`<body>
        <input class="addTask__input" />
        <div class="taskList"></div>
      </body>`);
    window = dom.window;
    document = window.document;
    taskInput = document.querySelector(".addTask__input");
    taskList = document.querySelector(".taskList");
  });
  it("should add a task div to the list", () => {
    taskInput.value = "Learn Mocha";
    const fakeSave = () => {};
    const fakeCounter = () => {};
    const task = addTask(taskList, taskInput, fakeSave, fakeCounter);

    expect(task).to.not.be.null;
    expect(task.classList.contains("tasklist__task")).to.be.true;
    expect(taskList.children.length).to.equal(1);
    expect(task.querySelector("p").textContent).to.equal("Learn Mocha");
  });

  it("should return null if task is empty", () => {
    taskInput.value = "";
    const task = addTask(
      taskList,
      taskInput,
      () => {},
      () => {}
    );
    expect(task).to.be.null;
    expect(taskList.children.length).to.equal(0);
  });
});
