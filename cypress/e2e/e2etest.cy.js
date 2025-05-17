describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html');
  });

it("displays one todo item by default",()=>{
  cy.get(".taskList").find("p").should("have.text","study all day something");
});

it("should delete task",()=>{
cy.get(".taskList").find(".tasklist__delete").click();
cy.get(".addTask__input").type("new task");
cy.get(".addTask__button").click();
cy.window().then((win)=>{
  const tasks = JSON.parse(win.localStorage.getItem("tasks"));
      expect(tasks.some(task=> task.text === "new task" )).to.be.true;
})
})


});

