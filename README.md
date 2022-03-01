## To do list

- 투두리스트 구현
- json-server를 활용해서 로컬에 REST API 구축 및 연동
- 기본적인 데이터 처리인 생성, 읽기, 수정, 삭제(CRUD)를 구현

### strict mode

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode

- 엄격하게 문법 검사를 실시하여 기존에는 무시되던 오류를 발생시킴

### json-server

https://github.com/typicode/json-server

- 짧은 시간에 REST API를 구축해주는 패키지
- 실제 프로덕션에서는 사용하지 않음
- npm을 통해 설치 가능
- 터미널에 npm install -g json-server
- Create a db.json file with some data
- json-server --watch db.json   (서버 실행)
- localhost:3000에 접속해서 데이터 확인
- localhost:3000/dataName/dataId (데이터 검색)

### DOMContentLoaded

https://developer.mozilla.org/ko/docs/Web/API/Window/DOMContentLoaded_event

- 초기 HTML 문서를 완전히 불러오고 분석했을 때 발생

```
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});
```

### Javacript fetch API

https://developer.mozilla.org/ko/docs/Web/API/Fetch_API

- AJAX 요청을 하기 위한 기술
- AJAX란 서버에서 추가 정보를 *비동기적*으로 가져올 수 있게 해주는 포괄적인 기술을 나타내는 용어
- XHR, JQuery, Fetch 등의 선택지가 있지만 이번 강의에서는 최신 기술인 fetch API를 사용

#### fetch API 사용법

https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch

- fetch api의 response는 실제 json 이 아니다.**
- 따라서 fetch api에서는 추가 메서드를 호출해 응답 본문을 받을 필요가 있다. (`.json()`)
  - axios는 이 과정을 자동으로 해주기 떄문에 바로 response를 받을 수 있다.
- body 데이터 타입은 헤더의 content-type 헤더와 일치해야 한다.

```
var url = 'https://example.com/profile';
var data = {username: 'example'};

fetch(url, {
  method: 'POST', // or 'PUT' or 'GET'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error));

```

### HTML data-\*

https://developer.mozilla.org/ko/docs/Learn/HTML/Howto/Use_data_attributes

- custom attibute를 만들 때 사용
- 표준이 아닌 속성이나 추가적인 DOM 속성

#### javascript에서 접근하기

- dataset 객체를 통해 data 속성을 가져오기 위해서는 속성 이름의 data- 뒷 부분을 사용
- 대시들은 camelCase로 변환되는 것에 주의

```
var article = document.getElementById('electriccars');

article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

#### javascript로 할당하기

```
var article = document.getElementById('electriccars');

article.dataset.columns = 3
article.dataset.indexNumber = "12314"
```



## To do list 페이지네이션 구현

- json-server를 활용해서 페이지네이션 구현

### 페이지네이션 이론

페이지네이션을 구현하기 위한 설정값

- currentPage: 현재 페이지
- totalCount: 총 데이터의 갯수
- pageCount: 화면에 나타날 페이지 갯수
- limit: 한 페이지 당 나타낼 데이터의 갯수

![](https://user-images.githubusercontent.com/16531837/145595161-ceb09871-bfe2-4a33-9e65-b53b0bd9d89f.png)

따라서...

- currentPage: 1
- totalCount: 53 (totalCount는 임의 설정)
- pageCount: 5
- limit: 5

#### 총 페이지 갯수 계산하기

```js
let totalPage = Math.ceil(totalCount / limit)
```

예를 들어보면,

```js
const totalCount = 53
const limit = 5

let totalPage = Math.ceil(totalCount / limit) // 11
```

#### 현재 페이지의 그룹 계산하기

![](https://user-images.githubusercontent.com/16531837/145596540-7c1ff5e6-60f8-40fc-884b-c10f4f4716a2.png)

현재 페이지가 몇번째 그룹에 속해있는지를 알아야
현재 페이지 그룹 상의 첫번째 숫자와 마지막 숫자를 구할 수 있다.

```js
const currentPage = 1
const pageCount = 5

let pageGroup = Math.ceil(currentPage / pageCount) // 1
```

```js
const currentPage = 7
const pageCount = 5

let pageGroup = Math.ceil(currentPage / pageCount) // 2
```

#### 현재 페이지 그룹의 첫번째/마지막 숫자 구하기

이걸 알아야 현재 페이지 그룹의 첫번째~마지막 숫자만큼 페이지를 화면에 표시해줄 수 있다.
그리고 페이지네이션의 이전, 다음을 구현할 수 있다
이전을 누르면 이전 그룹으로 넘겨주고 다음을 누르면 다음 그룹으로 넘겨준다.

```js
const pageGroup = 1
const pageCount = 5
const totalPage = 11

let lastNumber = pageGroup * pageCount // 5
if (lastNumber > totalPage) {
  lastNumber = totalPage
}
let firstNumber = lastNumber - (pageCount - 1) // 1

const next = lastNumber + 1 // 6
const prev = firstNumber - 1 // 0

// 1~5만큼 페이지네이션 그려줌
for (let i = firstNumber; i <= lastNumber; i++) {
  html += `<button class="pageNumber" id="page_${i}">${i}</button>`
}
```

```js
const pageGroup = 2
const pageCount = 5
const totalPage = 11

let lastNumber = pageGroup * pageCount // 10
if (lastNumber > totalPage) {
  lastNumber = totalPage
}
let firstNumber = lastNumber - (pageCount - 1) // 6

const next = lastNumber + 1 // 11
const prev = firstNumber - 1 // 5
```

```js
const pageGroup = 3
const pageCount = 5
const totalPage = 11

let lastNumber = pageGroup * pageCount // 15
if (lastNumber > totalPage) {
  lastNumber = totalPage // 11
}
let firstNumber = lastNumber - (pageCount - 1) // 7

const next = lastNumber + 1 // 12
const prev = firstNumber - 1 // 6
```


## To do list 추천 구현

- json-server를 활용해서 추천 클릭시 추천기능 구현
- 타이틀 클릭시 edit 기능 추가
- esc 키 입력시에 수정 취소 기능 추가
- enter 키 입력시에 수정 기능 추가
### json-server
https://github.com/typicode/json-server
```
json-server --watch db.json
```