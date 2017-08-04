// ref: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Decimal_rounding
export function formatValue(formatType, formatValue, formatExp) {
  let _formatExp;
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  if (Math.abs(Number(formatValue)) >= 1) {
    _formatExp = -3;
  } else {
    _formatExp = formatExp;
  }

  switch (formatType) {
    case 'round':
      return decimalAdjust('round', formatValue, _formatExp);
      break;
    case 'floor':
      return decimalAdjust('floor', formatValue, _formatExp);
      break;
    case 'ceil':
      return decimalAdjust('ceil', formatValue, _formatExp);
      break;
  }
}