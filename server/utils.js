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

//
exports.getBeginningOfTheWeek = (now) => {
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days);
  now.setHours(0, 0, 0, 0);
  return now;
};

//get beginning of the day
exports.getBeginningOfTheDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  // date.setUTCHours(0, 0, 0, 0);
  return date;
};
//get ending of the day
exports.getEndingOfTheDay = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 0);
  // date.setUTCHours(23, 59, 59, 0);
  return date;
};
