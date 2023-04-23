import { $ } from "./app.js";

// -- Variables
let DAYOFWEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

let year = new Date().getFullYear(),
  month = new Date().getMonth() + 1;

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
      const dayEl = `<td>${el.getDate()}</td>`;
      if (idx % 7 === 0) {
        return `<tr>${dayEl}`;
      } else if ((idx + 1) % 7 === 0) {
        return `${dayEl}</tr>`;
      } else {
        return dayEl;
      }
    })
    .join(" ");

  return [daysTemplate, dateTemplate];
}

// 캘린더 렌더링
function renderCalendar() {
  const [days, dates] = createTemplate(year, month);
  const captionYear = year,
    captionMonth = new Date().toString().slice(4, 7);

  $("#calendar-content time").dateTime = `${year}-0${month}`;
  $("#calendar-year-month").textContent = `${captionMonth} ${captionYear}`;
  $("#calendar-content tbody").innerHTML = `<tr>${days}</tr>${dates}`;
}

renderCalendar();
