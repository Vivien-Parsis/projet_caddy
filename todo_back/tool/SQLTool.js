/**
 * check if a variable is a integer
 */
const checkInt = (varToCheck) => {
    return Number.isInteger(Number(varToCheck));
};
/**
 * escape char like \ ' \n \r " NULL CTRL+Z to prevent mysql injection
 */
const correctMySQL = (param) => {
    return param
    .replaceAll("\\", "\\\\")
    .replaceAll("\'", "\\'")
    .replaceAll("\r", "\\\r")
    .replaceAll("\n", "\\\n")
    .replaceAll("\"", "\\\"")
    .replaceAll("\x00", "\\\x00")
    .replaceAll("\x1a", "\\\x1a");
};
/**
 * check if date respect the date format of mysql date type
 * check first is the date is a string.
 * if is so, check if format is xxx-xxx-xxx.
 * if is so, check if format is (any_int)-(any_int)-(any_int) and first is four char length and the two other two char length.
 * if is so, check if the second one is between 1 and 12 both includes and if the third is between 1 and 28 or 30 or 31 both includes.
 * if is so, return true, else false.
 */
const checkDate = (date) => {
    return typeof date == "string" ?
    date.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/g) != null ? 
    date.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/g).length == 1 && date.length == 10 ?
    checkMonth(date.split("-")[1]) && checkDay(date.split("-")[2],date.split("-")[1],date.split("-")[0]) ?
    true : false : false : false : false;
};
const checkMonth = (month) => {
    return month>=1 && month<=12;
}
const checkDay = (day, month, year) => {
    const numberOfDaysPerMonth = {
        "notLeapYear":[31,28,31,30,31,30,31,31,30,31,30,31],
        "LeapYear":[31,29,31,30,31,30,31,31,30,31,30,31]
    };
    return Number(day) >= 1 && Number(day) <= numberOfDaysPerMonth[`${isLeapYear(year) ? "LeapYear" : "notLeapYear"}`][Number(month) - 1];
}
const isLeapYear = (year) => {
    return Number(year) % 4 == 0 && Number(year) % 100 != 0 || Number(year) % 400 == 0;
}
module.exports = {checkInt,checkDate,correctMySQL};