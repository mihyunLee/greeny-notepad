const $ = (selector) => document.querySelector(selector);

let allMemo = JSON.parse(localStorage.getItem("allMemo")) ?? [];
let today = new Date();

// toastui editor
const Editor = toastui.Editor;

const editor = new Editor({
  el: document.querySelector("#editor"),
  height: "calc(100vh - 220px)",
  initialEditType: "markdown",
  previewStyle: "vertical",
  placeholder: "내용을 입력해주세요.",
});

render();
initEventListener();

// 로컬 스토리지에 새로운 메모 데이터 추가
function addMemo() {
  const title = document.getElementById("title").value;
  const content = parseMd(editor.getMarkdown());
  const date = new Date().getTime();

  if (title && confirm("새 메모를 추가하시겠습니까?")) {
    allMemo.push({ id: Date.now(), title, content, date });
    localStorage.setItem("allMemo", JSON.stringify(allMemo));

    reset();
    render();
  }
}

// 입력 폼과 에디터 초기화
function reset() {
  $("#memo-form").reset();
  editor.reset();
}

// 메모 삭제
function remove(e) {
  const li = e.target.parentElement;
  console.log(li);
  li.remove();
  allMemo = allMemo.filter((memo) => memo.id !== parseInt(li.id));
  localStorage.setItem("allMemo", JSON.stringify(allMemo));

  render();
}

// 오늘 날짜와 메모의 날짜 비교
function compareDate(origin, target) {
  const originDate = new Date(
    origin.getFullYear(),
    origin.getMonth(),
    origin.getDate()
  );
  const targetDate = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  return originDate.getTime() === targetDate.getTime();
}

// 화면에 메모 리스트 렌더링
function render() {
  $("#memo-list").innerHTML = "";

  // 오늘 날짜에 해당하는 메모 리스트
  const filterdMemoList = allMemo.filter((el) =>
    compareDate(today, new Date(el.date))
  );

  // 최신 게시물이 위로 올라오도록
  for (let i = filterdMemoList.length - 1; i >= 0; i--) {
    const memoItem = document.createElement("li");
    const title = document.createElement("h3");
    const content = document.createElement("p");
    const deleteMemoBtn = document.createElement("button");
    memoItem.id = filterdMemoList[i].id;
    title.textContent = filterdMemoList[i].title;
    content.innerHTML = filterdMemoList[i].content;
    deleteMemoBtn.textContent = "삭제";
    deleteMemoBtn.setAttribute("class", "btn-del");
    memoItem.appendChild(title);
    memoItem.appendChild(content);
    memoItem.appendChild(deleteMemoBtn);
    $("#memo-list").appendChild(memoItem);
  }
}

function initEventListener() {
  // form 태그가 자동으로 전송되는 것 막기
  $("#memo-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 메모 추가
  $("#memo-add-button").addEventListener("click", addMemo);

  // 메모 삭제
  $("#memo-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-del")) {
      remove(e);
    }
  });
}
