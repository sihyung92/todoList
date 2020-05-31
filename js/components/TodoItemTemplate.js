export const TodoItemTemplate = (item) =>
    '      <li id = \"' + item.id + '\" >\n' +
    '        <div class="view">\n' +
    '          <input class="toggle" type="checkbox">\n' +
    '          <label class="label">' + item.content + '</label>\n' +
    '          <button class="destroy"></button>\n' +
    '        </div>\n' +
    '        <input class="edit" value=\"' + item.content + '\">\n' +
    '      </li>'

