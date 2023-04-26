import { $, compareDate } from "./utils.js";
import { render } from "./app.js";

// -- Variables
let DAYOFWEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

let curDate = new Date();
let calendarDate = curDate;
let year = new Date().getFullYear(),
  month = new Date().getMonth() + 1;

renderCalendar(year, month);
renderMemo(curDate);
initEventListener();

// -- Functions
// 기존 날짜에 특정 일 수를 더함
function addDays(day, days) {
  let newDay = new Date(day);
  newDay.setDate(day.getDate() + days);

  return newDay;
}

// 한 페이지의 달력에 해당하는 일 생성
function createDays(newYear, newMonth) {
  const monthStart = new Date(newYear, newMonth - 1, 1); // 달의 시작일
  const monthEnd = new Date(newYear, newMonth, 1); // 다음달의 시작일
  const startDate = new Date(newYear, newMonth - 1, -monthStart.getDay() + 1); // 첫 주의 시작일
  const endDate = new Date(newYear, newMonth, 7 - monthEnd.getDay()); // 마지막 주의 마지막일

  let days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
}

// 날짜에 해당하는 데이터가 있는지 찾음
function findData(calendarDate) {
  const allMemo = JSON.parse(localStorage.getItem("allMemo")) ?? [];
  const filterdMemoList = allMemo.filter((el) =>
    compareDate(calendarDate, new Date(el.date))
  );

  return filterdMemoList.length;
}

// 요일및 날짜 템플릿 생성
function createTemplate(newYear, newMonth) {
  const daysTemplate = DAYOFWEEK.map((el) => `<th scope="col">${el}</th>`).join(
    " "
  );
  const days = createDays(newYear, newMonth);
  const dateTemplate = days
    .map((el, idx) => {
      const dayEl = document.createElement("td");
      dayEl.textContent = el.getDate();
      dayEl.dataset.id = el;

      // 이번달에 해당하는 날짜가 아닐 때
      if (el.getMonth() + 1 !== newMonth) {
        dayEl.classList.add("not-curMonth");
      }

      // 오늘일 때
      if (compareDate(curDate, el)) {
        dayEl.classList.add("today");
      }

      // 날짜에 메모가 기입되어 있을 때
      if (findData(el)) {
        dayEl.classList.add("mark");
      }

      // 일주일 별로 날짜 요소 생성
      if (idx % 7 === 0) {
        return "<tr>" + dayEl.outerHTML;
      } else if ((idx + 1) % 7 === 0) {
        return dayEl.outerHTML + "</tr>";
      } else {
        return dayEl.outerHTML;
      }
    })
    .join(" ");

  return [daysTemplate, dateTemplate];
}

// 캘린더 렌더링
function renderCalendar(pYear, pMonth) {
  const newDate = new Date(pYear, pMonth - 1);
  const newYear = newDate.getFullYear();
  const newMonth = newDate.getMonth();

  const [days, dates] = createTemplate(newYear, newMonth + 1);
  const captionYear = newYear,
    captionMonth = newDate.toString().slice(4, 7);

  $("#calendar-content time").dateTime = `${newYear}-0${newMonth + 1}`;
  $("#calendar-year-month").textContent = `${captionMonth} ${captionYear}`;
  $("#calendar-content tbody").innerHTML = `<tr>${days}</tr>${dates}`;
}

// 캘린더 날짜에 따른 메모 렌더링
function renderMemo(calendarDate) {
  $(".display-date .date").textContent = calendarDate.getDate();
  $(".display-date .day").textContent = DAYOFWEEK[calendarDate.getDay()];

  render(calendarDate);
}

let originTarget = $(".today"); // 이전에 누른 e.target 값을 기록하기 위한 변수
let todayEl = $(".today");
function initEventListener() {
  $("#calendar-content").addEventListener("click", (e) => {
    // 이전 달 버튼 클릭
    if (e.target.classList.contains("calendar-button-prev")) {
      month -= 1;
      renderCalendar(year, month);
      return;
    }

    // 다음 달 버튼 클릭
    if (e.target.classList.contains("calendar-button-next")) {
      month += 1;
      renderCalendar(year, month);
      return;
    }

    // 날짜 클릭
    if (e.target.nodeName === "TD") {
      // 클릭한 날짜에만 스타일 주기
      const newTarget = e.target;

      if (originTarget !== null && newTarget !== (originTarget && todayEl)) {
        // 이전에 누른 target과 새로 누른 target이 다르고, 오늘 날짜가 아닐 때에만 실행
        originTarget.classList.remove("current-date");
        newTarget.classList.add("current-date");
      } else if (newTarget === todayEl) {
        originTarget.classList.remove("current-date");
      }

      originTarget = newTarget;

      // 클릭한 날짜에 맞는 메모 리스트 렌더링
      calendarDate = new Date(e.target.dataset.id);
      renderMemo(calendarDate);

      return;
    }
  });
}
