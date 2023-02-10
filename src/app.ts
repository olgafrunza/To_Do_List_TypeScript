interface TaskInterface {
  id: number;
  item: string;
  completed: boolean;
}

class Task implements TaskInterface {
  id: number;
  item: string;
  completed: boolean;

  constructor(taskToBeDone: string) {
    this.id = Math.floor(Math.random() * 5000);
    this.item = taskToBeDone;
    this.completed = false;
  }
}

class TaskList {
  tasks: Task[];

  constructor() {
    this.tasks = new Array();
    const tasksInStore = localStorage.getItem("myTodos");
    if (tasksInStore) {
      this.tasks = JSON.parse(tasksInStore);
      console.log(this.tasks);
    }
    // console.log(tasksInStore);
  }

  addTask(task: Task) {
    this.tasks.push(task);
    localStorage.setItem("myTodos", JSON.stringify(this.tasks));
    sessionStorage.setItem("myTodos", JSON.stringify(this.tasks));
  }

  removeTask(id: number) {
    const index = this.tasks.findIndex((item) => item.id === id);
    this.tasks.splice(index, 1);
    localStorage.setItem("myTodos", JSON.stringify(this.tasks));
  }

  toggleTask(id: number) {
    const index = this.tasks.findIndex((item) => item.id === id);
    this.tasks[index].completed = !this.tasks[index].completed;
    localStorage.setItem("myTodos", JSON.stringify(this.tasks));
  }
}

class UI {
  private form: HTMLFormElement;
  private inputElm: HTMLInputElement;
  private ulTodoList: HTMLUListElement;

  allTodos: TaskList;

  constructor() {
    this.form = document.getElementById("todo-form") as HTMLFormElement;
    this.inputElm = document.getElementById("todo-item") as HTMLInputElement;
    this.ulTodoList = document.getElementById("todo-list") as HTMLUListElement;

    this.allTodos = new TaskList();

    // this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.form.addEventListener("submit", this.handleSubmit);
    this.ulTodoList.addEventListener("click", this.handleClick);
    this.renderAllTodos();

    // console.log(this);
  }

  renderAllTodos() {
    this.allTodos.tasks.forEach((item) => this.createLi(item));
  }

  handleClick = (e: Event) => {
    console.log(e.target);
    const elm = e.target as HTMLElement;
    if (elm.classList.contains("bi-trash")) {
      console.log("delete task");
      const id = (<HTMLElement>elm.parentElement).dataset.id;
      (elm.parentElement as HTMLElement).remove();
      this.allTodos.removeTask(Number(id));
      console.log(this.allTodos.tasks);
    } else {
      const id = elm.dataset.id;
      elm.classList.toggle("text-decoration-line-through");
      console.log(this.allTodos.tasks);
      this.allTodos.toggleTask(Number(id));
    }
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    const text = this.inputElm.value;
    this.inputElm.value = "";
    const task = new Task(text);
    this.allTodos.addTask(task);
    console.log(this.allTodos.tasks);
    this.createLi(task);
  };

  createLi(task: Task) {
    const elm = document.createElement("li");
    elm.dataset.id = task.id.toString();
    elm.innerHTML = `${task.item}<i class="bi bi-trash" style="color: red"></i>`;
    elm.classList.add(
      "list-group-item",
      "list-group-item-action",
      "list-group-item-success",
      "d-flex",
      "align-items-center",
      "justify-content-between",
      "border-0",
      "mb-2",
      "rounded"
    );
    if (task.completed) {
      elm.classList.add("text-decoration-line-through");
    }
    this.ulTodoList.appendChild(elm);
  }
}

const ui = new UI();
