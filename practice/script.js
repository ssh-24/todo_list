;(function () {// 즉시 실행함수로 감싸져있음
  'use strict' // 엄격모드 적용

  // querySelector 쉽게 사용하는 Helper 함수
  const get = (target) => {
    return document.querySelector(target)
  }

  const $todos = get('.todos');

  const createTodoElement = (item) => {
    const { id, content } = item
    const $todoItem = document.createElement('div') // div Element 생성
    $todoItem.classList.add('item') // item 클래스 추가
    $todoItem.dataset.id = id // data id 추가
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = ''; // 초기화
    todos.forEach(item => {
      const todoElement = createTodoElement(item); // Element 생성
      $todos.appendChild(todoElement); // 자식으로 추가
    })
  }

  const getTodos = () => {
    fetch('http://localhost:3000/todos')
    .then((response) => response.json())
    .then((todos) => renderAllTodos(todos))
    .catch((error) => console.error(error));
    // fetchApi로 데이터 가져오기, json으로 변환하고, 렌더링.
  }

  // 파일 실행되면 실행되는 init 함수
  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
    })
  }
  init()
})()
