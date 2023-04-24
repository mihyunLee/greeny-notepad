import { $, compareDate } from "./utils.js";

// -- Variables
let DAYOFWEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

let curDate = new Date();
let year = new Date().getFullYear(),
  month = new Date().getMonth() + 1;

renderCalendar(year, month);
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

      if (el.getMonth() + 1 !== newMonth) {
        dayEl.classList.add("not-curMonth");
      }

      if (compareDate(curDate, el)) {
        dayEl.classList.add("today");
      }

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
  });
}
