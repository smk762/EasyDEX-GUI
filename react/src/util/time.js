export function secondsToString(seconds, skipMultiply, showSeconds) {
  const a = new Date(seconds * (skipMultiply ? 1 : 1000)),
        months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        year = a.getFullYear(),
        month = months[a.getMonth()],
        date = a.getDate(),
        hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours(),
        min = a.getMinutes() < 10 ? `0 ${a.getMinutes()}` : a.getMinutes(),
        sec = a.getSeconds(),
        time = `${date} ${month} ${year} ${hour}:${min}${(showSeconds ? ':' + sec : '')}`;

  return time;
}

export function checkTimestamp(dateToCheck) {
  const currentEpochTime = new Date(Date.now()) / 1000,
        secondsElapsed = Number(currentEpochTime) - Number(dateToCheck / 1000);

  return Math.floor(secondsElapsed);
}

export function secondsElapsedToString(timestamp) { // in seconds
  const secondsElapsed = checkTimestamp(timestamp);
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp - (hours * 3600)) / 60);
  const seconds = timestamp - (hours * 3600) - (minutes * 60);
  const returnTimeVal = (hours > 0 ? hours + ' hour(s) ' : '') +
                        (minutes > 0 ? minutes + ' minute(s) ' : '') +
                        (seconds > 0 ? seconds + ' second(s) ' : '');

  return returnTimeVal;
}