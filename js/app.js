import {TodoItem} from "./components/TotoItem.js";

// 부모 컴포넌트
function TodoApp() {
    this.todoItems = [];

    this.setState = updatedItems => {
        this.todoItems = updatedItems;
        const todoList = new TodoList();
        todoList.setState(this.todoItems);
    };

    new TodoInput({
        onAdd: contents => {
            const newTodoItem = TodoItem(contents);
            this.todoItems.push(newTodoItem);
            this.setState(this.todoItems);
        }
    });
}

// 입력 받는 컴포넌트
function TodoInput({onAdd}) {
    const $todoInput = document.querySelector("#new-todo-title");

    $todoInput.addEventListener("keydown", event => this.addTodoItem(event));

    this.isValid = (event, value) => {
        if (event.key === "Enter") {
            return true;
        }
        return false;
    }

    this.addTodoItem = event => {
        const $newTodoTarget = event.target;
        if (this.isValid(event, $newTodoTarget.value)) {
            onAdd($newTodoTarget.value);
            $newTodoTarget.value = "";
        }
    };
}

// todoList 보여주는 컴포넌트
function TodoList() {
    this.$todoList = document.querySelector("#todo-list");

    this.setState = updatedTodoItems => {
        this.todoItems = updatedTodoItems;
        this.render(this.todoItems);
        const $checkBox = document.querySelectorAll("#todo-list .toggle");
        $checkBox.forEach($checkBox => $checkBox.addEventListener("click", event => this.completeItem(event)));
    };

    this.completeItem = event => {
        const $itemTarget = event.target.closest("li");
        $itemTarget.classList.contains("completed") ?
            $itemTarget.classList.remove("completed")
            : $itemTarget.classList.add("completed");
    };

    this.render = items => {
        console.log(items);
        this.$todoList.innerHTML = items.join("");
    };
}

const todoApp = new TodoApp();