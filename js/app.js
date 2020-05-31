import {TodoItemTemplate} from "./components/TodoItemTemplate.js";
import TodoItem from "./components/TodoItem.js";

// 부모 컴포넌트
function TodoApp() {
    this.idSequence = 0;
    this.todoItems = [];

    this.statusChange = {
        onAdd: contents => {
            const newTodoItem = TodoItem(this.idSequence++, contents);
            this.todoItems.push(newTodoItem);
            this.setState(this.todoItems);
        }
        , onRemove: id => {
            const idx = this.todoItems.indexOf(this.todoItems.find(item => item.id == id));
            if (idx > -1) this.todoItems.splice(idx, 1);
            this.setState(this.todoItems);
        }
        , onEdit: (id, content) => {
            const $todoItem = this.todoItems.find(item => item.id == id);
            if ($todoItem) $todoItem.content = content;
            this.setState(this.todoItems);
        }
    };

    this.setState = updatedItems => {
        this.todoItems = updatedItems;
        const todoList = new TodoList(this.statusChange);
        todoList.setState(this.todoItems);
    };

    new TodoInput(this.statusChange);
}

// 입력 받는 컴포넌트
function TodoInput({onAdd}) {
    const $todoInput = document.querySelector("#new-todo-title");

    $todoInput.addEventListener("keydown", event => this.addTodoItem(event));

    this.isValid = (event, value) => {
        if (value.trim() === "") {
            return false;
        }
        return event.key === "Enter";

    };

    this.addTodoItem = event => {
        const $newTodoTarget = event.target;
        if (this.isValid(event, $newTodoTarget.value)) {
            onAdd($newTodoTarget.value);
            $newTodoTarget.value = "";
        }
    };
}

// todoList 보여주는 컴포넌트
function TodoList({onRemove, onEdit}) {
    this.$todoList = document.querySelector("#todo-list");

    this.setState = updatedTodoItems => {
        this.todoItems = updatedTodoItems;
        this.render(this.todoItems);
        this.addTodoListEvent();
    };

    this.addTodoListEvent = () => {
        const $checkBoxes = this.$todoList.querySelectorAll("#todo-list .toggle");
        $checkBoxes.forEach($checkBox => $checkBox.addEventListener("click", event => this.completeItem(event)));

        const $destroyBtns = this.$todoList.querySelectorAll("#todo-list .destroy");
        $destroyBtns.forEach($destroyBtn => $destroyBtn.addEventListener("click", event => this.removeItem(event)));

        const $todoItems = this.$todoList.querySelectorAll("#todo-list li");
        $todoItems.forEach($todoItem => $todoItem.addEventListener("dblclick", event => this.editingItem(event)));
    };

    this.completeItem = event => {
        const $itemTarget = event.target.closest("li");
        $itemTarget.classList.contains("completed") ?
            $itemTarget.classList.remove("completed")
            : $itemTarget.classList.add("completed");
    };

    this.removeItem = event => {
        const itemId = event.target.closest("li").id;
        onRemove(itemId);
    };

    this.editingItem = event => {
        const $item = event.target.closest("li");
        const oldValue = $item.querySelector(".edit").value;
        $item.classList.add("editing");
        $item.querySelector(".edit").focus();
        $item.addEventListener("keydown", event => this.editItem(event, oldValue));
    };

    this.editItem = function (event, oldValue) {
        const $target = event.target;
        const $targetId = $target.closest("li").id;
        if (event.key === "Escape") {
            event.target.closest("li").classList.remove("editing");
            event.target.value = oldValue;
        }

        if (this.isValid(event, $target.value)) {
            onEdit($targetId,$target.value);
        }
    };

    this.isValid = (event, value) => {
        if (value.trim() === "") {
            return false;
        }
        return event.key === "Enter";
    };

    this.render = items => {
        this.$todoList.innerHTML = items.map(TodoItemTemplate).join("");
    };
}

const todoApp = new TodoApp();