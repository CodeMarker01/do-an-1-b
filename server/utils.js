// check string -> date is valid or not
exports.isValidDate = (date) => {
  let parsedDate = Date.parse(date);

  // You want to check again for !isNaN(parsedDate) here because Dates can be converted
  // to numbers, but a failed Date parse will not.
  if (isNaN(date) && !isNaN(parsedDate)) {
    /* do your work */
    return true;
  }
  return false;
};

exports.testXiu = (log) => {
  console.log(log);
};

// convert new date to string (with localTime)
// and then convert string into date type
exports.convertTZ = function (date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
};

// get beginning of the week
exports.getBeginningOfTheWeek = (now) => {
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days);
  now.setHours(0, 0, 0, 0);
  return now;
};

// get beginning of the week
exports.getEnddingOfTheWeek = (now) => {
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days + 6);
  now.setHours(23, 59, 59, 0);
  return now;
};

// get beginning of the month
exports.getBeginningOfTheMonth = (now) => {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return new Date(currentYear, currentMonth - 1, 1);
  // const days = new Date(currentYear, currentMonth - 1, 1);
  // return days;
};

// get beginning of the month
exports.getEnddingOfTheMonth = (now) => {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return new Date(currentYear, currentMonth, 0);
  // const days = new Date(currentYear, currentMonth, 0);
  // return days;
};

//get beginning of the day
exports.getBeginningOfTheDay = (date) => {
  const dateBegin = date ? new Date(date) : new Date();
  dateBegin.setHours(0, 0, 0, 0);
  // date.setUTCHours(0, 0, 0, 0);
  return dateBegin;
};
//get ending of the day
exports.getEndingOfTheDay = (date) => {
  const dateEnd = date ? new Date(date) : new Date();
  dateEnd.setHours(23, 59, 59, 0);
  // date.setUTCHours(23, 59, 59, 0);
  return dateEnd;
};

// get last 12 month

exports.renameKey = (obj, old_key, new_key) => {
  // check if old key = new key
  if (old_key !== new_key) {
    Object.defineProperty(
      obj,
      new_key, // modify old key
      // fetch description from object
      Object.getOwnPropertyDescriptor(obj, old_key)
    );
    delete obj[old_key]; // delete old key
  }
};

// format hh:mm 24 hour
exports.formatTimeVi = (time) => {
  return new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hour12: false,
  }).format(new Date(time));
};

//format dd/mm/yyyy
exports.formatDateVi = (date) => {
  return new Intl.DateTimeFormat("vi").format(new Date(date));
};
