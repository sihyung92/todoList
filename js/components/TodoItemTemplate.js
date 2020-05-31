export const TodoItemTemplate = (item) =>`
          <li id = "${item.id}" class="${item.status === "completed" ? "completed": ""}">
            <div class="view">
              <input class="toggle" type="checkbox" ${item.status === "completed" ? "checked": ""}>
              <label class="label">${ item.content }</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value="${item.content}">
          </li>`
