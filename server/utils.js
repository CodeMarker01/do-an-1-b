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
