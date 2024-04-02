const moment = require('moment');

module.exports = {
  format_date: (date) => {
    return moment(date).fromNow();
  },
  truncate: (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + '...';
    } else {
      return str;
    }
  }
};