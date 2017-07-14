export function sortByDate(data) {
  return data.sort(function(a, b) {
    if (a.timestamp &&
        b.timestamp) {
      return b.timestamp - a.timestamp;
    } else {
      return b.blocktime - a.blocktime;
    }
  });
}