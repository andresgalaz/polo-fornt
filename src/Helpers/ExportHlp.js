export default class ExportHlp {
  static tableColumn2CvsHeader(cols) {
    return cols.reduce((prev, curr, idx) => {
      const { title: label, key } = curr;
      prev.push({ label, key });
      return prev;
    }, []);
  }

  static fecha() {
    function twoDigit(n) {
      return (n < 10 ? "0" : "") + n;
    }

    var now = new Date();
    return "" + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
  }
}
