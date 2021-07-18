// format mm/dd/yyyy
export function formatDate(date) {
  return new Intl.DateTimeFormat().format(new Date(date));
}

//format dd/mm/yyyy
export function formatDateVi(date) {
  return new Intl.DateTimeFormat("vi").format(new Date(date));
}

// format hh:mm 24 hour
export function formatTimeVi(time) {
  return new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hour12: false,
  }).format(new Date(time));
}

// export default formatDate;

// convert hour to HH:MM
// 54 -> 54:00
export function hourToHHMM(num) {
  if (!num) return "--:--";
  let hrs = parseInt(Number(num));
  let min = Math.round((Number(num) - hrs) * 60);
  if (min < 10) {
    min = "0" + min;
  }
  return hrs + ":" + min;
}

//get beginning of the day
export const getBeginningOfTheDay = (date) => {
  const dateBegin = date ? new Date(date) : new Date();
  dateBegin.setHours(0, 0, 0, 0);
  // date.setUTCHours(0, 0, 0, 0);
  return dateBegin;
};
//get ending of the day
export const getEndingOfTheDay = (date) => {
  const dateEnd = date ? new Date(date) : new Date();
  dateEnd.setHours(23, 59, 59, 0);
  // date.setUTCHours(23, 59, 59, 0);
  return dateEnd;
};

// get beginning of the week
export const getBeginningOfTheWeek = (now) => {
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days);
  now.setHours(0, 0, 0, 0);
  return now;
};

// get beginning of the week
export const getEnddingOfTheWeek = (now) => {
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days + 6);
  now.setHours(23, 59, 59, 0);
  return now;
};

// get beginning of the month
export const getBeginningOfTheMonth = (now) => {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return new Date(currentYear, currentMonth - 1, 1);
  // const days = new Date(currentYear, currentMonth - 1, 1);
  // return days;
};

// get beginning of the month
export const getEnddingOfTheMonth = (now) => {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return new Date(currentYear, currentMonth, 0);
  // const days = new Date(currentYear, currentMonth, 0);
  // return days;
};
