//Vanilla JavaScript Fetch API Function
async function fetchAsync(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
async function postFetchAsync(url) {
  let response = await fetch(url, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json"
    }
  });
  let data = await response.json();
  return data;
}
async function putFetchAsync(url) {
  let response = await fetch(url, {
    method: "PUT", // or 'POST'
    headers: {
      "Content-Type": "application/json"
    }
  });
  let data = await response.json();
  return data;
}

const UIController = (function() {
  const DOMString = {
    day: ".date--day",
    month: ".date--month",
    year: ".date--year",
    addInput: ".add__input",
    addBtn: ".add__circle",
    taskListContainer: ".result__list",
    listTask: ".list__task",
    checkedBtn: ".list__task--check",
    taskText: ".list__task--text",
    editBtn: ".list__task--edit",
    delBtn: ".list__task--del"
  };

  return {
    testUI: function() {
      console.log("Call from UI");
    },

    getDOMString: function() {
      return DOMString;
    },

    getInput: function() {
      return document.querySelector(DOMString.addInput).value;
    },

    clearInput: function() {
      return (document.querySelector(DOMString.addInput).value = "");
    },
    addTaskList: function(tasks) {
      const element = DOMString.taskListContainer;

      const html =
        "<li class='list__task' id='task-%id%'><button class='list__task--check' id='check'><i class='ion-ios-checkmark'></i></button><div class='list__task--text'>%description%</div><button class='list__task--del' id='del'><i class='ion-android-delete'></i></button></li>";

      markup = html.replace("%id%", tasks.id);
      markup = markup.replace("%description%", tasks.description);

      document.querySelector(element).insertAdjacentHTML("afterbegin", markup);
    },

    checkedTaskList: function(id) {
      const taskID = "task-" + id;

      const el = document.querySelectorAll(DOMString.listTask);

      for (i = 0; i < el.length; i++) {
        const listID = el[i].id;

        if (taskID === listID) {
          el[i].childNodes[0].classList.toggle("list__task--checked");
          el[i].childNodes[1].classList.toggle("list__task--text--checked");
        }
      }
    },

    deleteTaskList: function(id) {
      const el = document.getElementById("task-" + id);
      el.parentNode.removeChild(el);
    },

    displayMonth: function() {
      const now = new Date();

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      const day = now.getDate();
      const month = now.getMonth();
      const year = now.getFullYear();

      document.querySelector(DOMString.day).textContent = day;
      document.querySelector(DOMString.month).textContent = months[month];
      document.querySelector(DOMString.year).textContent = year;
    }
  };
})();

const TodolistController = (function() {
  const Task = function(description) {
    this.description = description;
  };

  return {
    //Get all tasks
    getdbTasks: function() {
      fetchAsync("/api/list")
        .then(data => {
          const todayTasks = [];
          for (i = 0; i < data.length; i++) {
            if (data[i].hidden === 0) {
              todayTasks.push({
                id: data[i].id,
                description: data[i].body,
                completed: data[i].completed
              });
            }
          }
          todayTasks.forEach(task => {
            UIController.addTaskList(task);
            if (task.completed === 1) {
              UIController.checkedTaskList(task.id);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    testModel: function() {
      console.log("Call from Model");
    },
    createNewTask: function(description) {
      addItem = new Task(description);
      postFetchAsync(
        "/api/list",
        {
          description: addItem.description
        }
          .then(data => {
            console.log(data);
            return data;
          })
          .catch(err => {
            console.log(err);
          })
      );
    },
    completeTask: function(id) {
      putFetchAsync(`/api/list/complete/:${id}`)
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteTask: function(id) {
      putFetchAsync(`/api/list/hide/:${id}`)
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
})();

const MainController = (function(TodoCtrl, UICtrl) {
  const setupEventListener = function() {
    const DOM = UICtrl.getDOMString();

    document.querySelector(DOM.addBtn).addEventListener("click", ctrlAdd);

    document.querySelector(DOM.addInput).addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAdd();
      }
    });

    document
      .querySelector(DOM.taskListContainer)
      .addEventListener("click", ctrlEventCheck);
  };

  const ctrlAdd = function() {
    const item = UICtrl.getInput();

    if (item !== "" && item !== " ") {
      const tasks = TodoCtrl.createNewTask(item);

      UICtrl.addTaskList(tasks);
      UICtrl.clearInput();
    }
  };

  const ctrlEventCheck = function(event) {
    const itemID = event.target.parentNode.parentNode.id;
    const itemClass = event.target.parentNode.id;

    const IdSplit = itemID.split("-");

    const ID = IdSplit[1];

    if (itemClass === "check") {
      TodoCtrl.completeTask(ID);
      UICtrl.checkedTaskList(ID);
    } else if (itemClass === "del") {
      TodoCtrl.deleteTask(ID);
      UICtrl.deleteTaskList(ID);
    }
  };

  return {
    init: function() {
      console.log("script.js : connecting..");
      setupEventListener();
      UICtrl.displayMonth();
      TodoCtrl.getdbTasks();
    }
  };
})(TodolistController, UIController);

MainController.init();
