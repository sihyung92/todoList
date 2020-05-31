export const TodoItem = (contents) =>
    '      <li>\n' +
    '        <div id = \"' + contents + '\" class="view">\n' +
    '          <input class="toggle" type="checkbox">\n' +
    '          <label class="label">' + contents + '</label>\n' +
    '          <button class="destroy"></button>\n' +
    '        </div>\n' +
    '        <input class="edit" value=\"' + contents + '\">\n' +
    '      </li>'

