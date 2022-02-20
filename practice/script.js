;(function () {// 즉시 실행함수로 감싸져있음
  'use strict' // 엄격모드 적용

  // querySelector 쉽게 사용하는 Helper 함수
  const get = (target) => {
    return document.querySelector(target)
  }

  const API_URL = 'http://localhost:3000/todos'; // 자주 쓰는 값, 상수화
  const $todos = get('.todos');
  const $form = get('.todo_form');
  const $todoInput = get('.todo_input');

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
    fetch(API_URL)
    .then((response) => response.json())
    .then((todos) => renderAllTodos(todos))
    .catch((error) => console.error(error));
    // fetchApi로 데이터 가져오기, json으로 변환하고, 렌더링, 자식에 추가
  }

  const addTodo = (e) => {
    // 기본 submit 이벤트 동작 시 새로고침되는 것 제거
    e.preventDefault();
    // console.log($todoInput.value);
    const todo = {
      content: $todoInput.value,
      completed: false,
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo),
    }).then(getTodos)
    .then(() => {
      $todoInput.value = '',
      $todoInput.focus()
    }).catch((err) => console.log(err));
  }


  const toggleTodo = (e) => {
    // 상위 .todos에 이벤트 등록 후, 특정 클래스일때만 동작하도록 제어
    // console.log(e.target.className); // 이런 식으로 확인 가능
    if (e.target.className !== 'todo_checkbox') return;

    const $item = e.target.closest('.item')
    console.log($item)
    const id = $item.dataset.id; // item id 가져오기
    console.log(id)
    const completed = e.target.checked; // 체크 여부

    // `(백틱) 으로 해야 $ 인식
    // 특정 id 와 통신
    // PUT 은 전체, PATCH 는 부분
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed}),
    })
    .then(getTodos)
    .catch(err => console.log(err))
  }

  // 파일 실행되면 실행되는 init 함수
  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
    })

    $form.addEventListener('submit', addTodo)

    $todos.addEventListener('click', toggleTodo)
  }






  init()
})()
