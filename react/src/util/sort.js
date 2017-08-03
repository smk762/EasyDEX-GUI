export function sortByDate(data) {
  return data.sort(function(a, b) {
    if (a.confirmations &&
        b.confirmations) {
      return a.confirmations - b.confirmations;
    } else {
      return 1;
    }
  });
}