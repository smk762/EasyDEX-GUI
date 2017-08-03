export function sortByDate(data) {
  return data.sort(function(a, b) {
    if (a.txid === b.txid) {
      return 1;
    } else {
      return a.confirmations - b.confirmations;
    }
  });
}