export default function formatTime(dateTime) {
  if (dateTime != null) {
    var time = parseInt(dateTime);
    var date = new Date(time)
    var YY = date.getFullYear();
    var MM = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return YY + '-' + MM + '-' + DD;
  }
}