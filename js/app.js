import {TodoItemTemplate} from "./components/TodoItemTemplate.js";
import TodoItem from "./components/TodoItem.js";
import {KEY_TYPE} from "./constants/KEY_TYPE.js";
import {FILTER_TYPE} from "./constants/FILTER_TYPE.js";

// 부모 컴포넌트
function TodoApp() {
    this.idSequence = 0;
    this.todoItems = [];
    this.filter = FILTER_TYPE.ALL;
    this.status = {
        onAdd: contents => {
            const newTodoItem = TodoItem(this.idSequence++, contents);
            this.todoItems.push(newTodoItem);
            this.setState(this.todoItems);
        }
        , onToggle: id => {
            const toggledItem = this.todoItems.find(item => item.id === parseInt(id));
            if (!toggledItem) return false;
            toggledItem.status === FILTER_TYPE.ACTIVE ? toggledItem.status = FILTER_TYPE.COMPLETED : toggledItem.status = FILTER_TYPE.ACTIVE;
            if (this.filter !== FILTER_TYPE.ALL) {
                this.setState(this.todoItems);
            }
        }
        , onRemove: id => {
            const idx = this.todoItems.indexOf(this.todoItems.find(item => item.id === parseInt(id)));
            if (idx > -1) this.todoItems.splice(idx, 1);
            this.setState(this.todoItems);
        }
        , onEdit: (id, content) => {
            const $todoItem = this.todoItems.find(item => item.id === parseInt(id));
            if ($todoItem) $todoItem.content = content;
            this.setState(this.todoItems);
        }
        , calcCount: () => {
            return this.todoItems.length;
        }
        , filter: (filter) => {
            this.filter = filter;
            this.setState(this.todoItems);
        }
    };

    this.setState = (updatedItems) => {
        this.todoItems = updatedItems;
        if (this.filter !== FILTER_TYPE.ALL) {
            updatedItems = updatedItems.filter($item => $item.status === this.filter);
        }
        const todoList = new TodoList(this.status);
        new TodoCount(this.status);
        todoList.setState(updatedItems);
    };

    new TodoInput(this.status);
    new TodoFilter(this.status);
}

// 입력 받는 컴포넌트
function TodoInput({onAdd}) {
    const $todoInput = document.querySelector(".todoapp #new-todo-title");

    $todoInput.addEventListener("keydown", event => this.addTodoItem(event));

    this.isValid = (event, value) => {
        if (value.trim() === "") {
            return false;
        }
        return event.key === KEY_TYPE.ENTER;
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
function TodoList({onToggle, onRemove, onEdit}) {
    this.$todoList = document.querySelector(".todoapp #todo-list");

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
        onToggle($itemTarget.id);
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
        if (event.key === KEY_TYPE.ESC) {
            event.target.closest("li").classList.remove("editing");
            event.target.value = oldValue;
        }

        if (this.isValid(event, $target.value)) {
            onEdit($targetId, $target.value);
        }
    };

    this.isValid = (event, value) => {
        if (value.trim() === "") {
            return false;
        }
        return event.key === KEY_TYPE.ENTER;
    };

    this.render = items => {
        this.$todoList.innerHTML = items.map(TodoItemTemplate).join("");
    };
}

function TodoCount({calcCount}) {
    const $todoCountNum = document.querySelector(".todoapp .todo-count strong");
    $todoCountNum.innerHTML = calcCount();
}

function TodoFilter({filter}) {
    this.$todoFilter = document.querySelectorAll(".todoapp .filters li a");
    this.$todoFilter.forEach($menu => $menu.addEventListener("click", event => this.filterTodoItem(event)));

    this.filterTodoItem = (event) => {
        if (!event.target.classList.contains("selected")) {
            this.$todoFilter.forEach($filter => $filter.classList.remove("selected"));
            event.target.classList.add("selected");
            if (event.target.classList.contains(FILTER_TYPE.ACTIVE)) {
                filter(FILTER_TYPE.ACTIVE);
                return;
            }
            if(event.target.classList.contains(FILTER_TYPE.COMPLETED)){
                filter(FILTER_TYPE.COMPLETED);
                return;
            }
            filter(FILTER_TYPE.ALL);
        }
    }
}

new TodoApp();