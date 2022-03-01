;(function () {// 즉시 실행함수로 감싸져있음
  'use strict' // 엄격모드 적용

  // Helper 함수
  const get = (target) => {
    return document.querySelector(target)
  }
  const getAll = (target) => {
    return document.querySelectorAll(target)
  }


  const API_URL = 'http://localhost:3000/todos'; // 요청 URL
  const $todos = get('.todos');
  const $form = get('.todo_form');
  const $todoInput = get('.todo_input');
  const $pagination = get('.pagination');

  // 페이지네이션 설정 값
  let currentPage = 1 // 현재 페이지
  const totalCount = 52 // 임의 설정하는 총 데이터의 갯수
  const pageCount = 5 // 화면에 나타날 페이지 갯수(버튼)
  const limit = 5 // 한페이지 데이터 갯수

  // 페이지네이션 함수, 첫 시작시 먼저 한 번 호출 필요
  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit) // 총 페이지
    let pageGroup = Math.ceil(currentPage / pageCount)

    let lastNumber = pageGroup * pageCount
    if (lastNumber > totalPage) {
      lastNumber = totalPage
    }
    let firstNumber = lastNumber - (pageCount - 1)

    const next = lastNumber + 1
    const prev = firstNumber - 1

    let html = ''
    
    // 1 ~ 5만큼 페이지네이션 그려줌
    if (prev > 0) {
      html += `<button class="prev" data-fn="prev">이전</button>`
    }
    for (let i = firstNumber; i <= lastNumber; i++) {
      // 숫자 버튼 생성
      html += `<button class="pageNumber" id="page_${i}">${i}</button>`
    }
    if (lastNumber < totalPage) {
      html += `<button class="prev" data-fn="next">다음</button>`
    }
    $pagination.innerHTML = html;
  
    // pageNumber의 id로 몇번째 페이지인지 찾기
    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`)
    $currentPageNumber.style.color = '#9dc0e8'
  

    // 버튼들 가져오기
    const $currentPageNumbers = getAll('.pagination button')
    // click event 바인딩
    $currentPageNumbers.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.fn === 'prev') {
          // html에서 data-fn의 값이 prev 이면
          currentPage = prev
        }
        else if (button.dataset.fn === 'next') {
          // html에서 data-fn의 값이 next 이면
          currentPage = next
        }
        else { // 버튼이 숫자인 경우
          currentPage = button.innerText
        }

        // 다시 페이지, 항목들 새로고침
        pagination()
        getTodos()
      })
    })
  }


  const createTodoElement = (item) => {
    const { id, content, completed } = item
    const $todoItem = document.createElement('div') // div Element 생성
    const isChecked = completed ? 'checked' : '' // completed가 true면 checked (체크박스 체크표시), 아니면 공백
    $todoItem.classList.add('item') // item 클래스 추가
    $todoItem.dataset.id = id // data id 추가
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox'
                ${isChecked}
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
    // 페이지 단위로 끊어서 가져오도록 설정
    // 현재 5개 단위로 가져온 첫번째 페이지를 보여줌
    fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`)
    .then((response) => response.json())
    .then((todos) => renderAllTodos(todos))
    .catch((error) => alert("서버연결 실패...\n 터미널 ==> json-server --watch db.json"));
    // fetchApi로 데이터 가져오기, json으로 변환하고, 렌더링, 자식에 추가
  }

  const addTodo = (e) => {
    // 기본 submit 이벤트 동작 시 새로고침되는 것 제거
    e.preventDefault();

    const content = $todoInput.value
    if (!content) return; // 내용 없을 시 종료
    const todo = {
      content,
      completed: false,
    }
    
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo), // 위의 todo, content와 completed 가짐
    }).then(getTodos)
    .then(() => {
      $todoInput.value = '',
      $todoInput.focus()
    }).catch((error) => console.error(error.message));
  }


  const toggleTodo = (e) => {
    // 상위 .todos에 이벤트 등록 후, 특정 클래스일때만 동작하도록 제어
    // console.log(e.target.className); // 이런 식으로 확인 가능
    if (e.target.className !== 'todo_checkbox') return;

    const $item = e.target.closest('.item')
    const id = $item.dataset.id; // item id 가져오기
    const completed = e.target.checked; // 체크 여부

    // `(백틱) 으로 해야 $ 인식
    // 특정 id 와 통신
    // **PUT 은 전체, PATCH 는 부분**
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed}), // e.target.checked
    })
    .then((response) => response.json())
    .then(getTodos)
    .catch((error) => console.error(error.message));
  }


  const changeEditMode = (e) => {
    // item을 먼저 가져옴
    const $item = e.target.closest('.item')
    const $label = $item.querySelector('label')
    const $editInput = $item.querySelector('input[type="text"]')
    const $contentButtons = $item.querySelector('.content_buttons')
    const $editButtons = $item.querySelector('.edit_buttons')
    const value = $editInput.value // 미리 값 담아두기

    // 편집 버튼
    if (e.target.className === 'todo_edit_button') {
      $label.style.display = 'none'
      $editInput.style.display = 'block'
      $contentButtons.style.display = 'none'
      $editButtons.style.display = 'block'

      $editInput.focus() // focus 처리, 값의 맨 앞으로 감
      $editInput.value = ''; // 이렇게 한번 비우고 값을 다시 넣으면
      $editInput.value = value; // 커서를 맨 뒤로 위치시킬 수 있음
    }

    // 취소 버튼
    if (e.target.className === 'todo_edit_cancel_button') {
      $label.style.display = 'block'
      $editInput.style.display = 'none'
      $contentButtons.style.display = 'block'
      $editButtons.style.display = 'none'

      $editInput.value = $label.innerText // 이전의 입력하다 취소한 값이 남아있지 않게
    }
  }
  

  const editTodo = (e) => {
    // 확인 버튼 아닐 경우 return 
    if (e.target.className !== 'todo_edit_confirm_button') return

    const $item = e.target.closest('.item') // target과 가장 가까운 item찾아오기
    const id = $item.dataset.id
    const $editInput = $item.querySelector('input[type="text"]')
    const content = $editInput.value // Input에 입력한 value 가져오기

    // fetch로 데이터 수정
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({content}), // editInput.value
    })
    .then(getTodos)
    .catch(err => console.log(err))
  }


  // 삭제 버튼
  const removeTodo = (e) => {
    if (e.target.className !== 'todo_remove_button') return

    const $item = e.target.closest('.item')
    const id = $item.dataset.id

    if(confirm("정말 삭제하시겠습니까?\n삭제 시 복구되지 않습니다.")){
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE' // headers나 body를 보낼 필요가 없음
    })
    .then(alert("삭제되었습니다!!"),getTodos)
    .catch(err => console.log(err))
    }
    else alert("취소되었습니다!!")
  }

  
  // 파일 실행되면 실행되는 init 함수
  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
      pagination();
    })
    $form.addEventListener('submit', addTodo)
    $todos.addEventListener('click', toggleTodo)
    $todos.addEventListener('click', changeEditMode)
    $todos.addEventListener('click', editTodo)
    $todos.addEventListener('click', removeTodo)
  }
  init()
})()
