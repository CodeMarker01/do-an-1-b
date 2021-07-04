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
