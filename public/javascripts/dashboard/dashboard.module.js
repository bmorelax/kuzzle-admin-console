angular.module('kuzzle.dashboard', [
  'kuzzle.authentication'
])
  .filter('secondsToDateTime', function($filter) {
    return function(seconds) {
      var
        date,
        dateFormat;

      if (!seconds) {
        return '';
      }

      seconds = seconds.replace(/[a-zA-Z]/, '');
      date = new Date(0, 0, 0).setSeconds(seconds);

      /* eslint-disable quotes */
      if (seconds < 60) {
        dateFormat = "s's'";
      }
      else if (seconds < (60*60)) {
        dateFormat = "m'm' s's'";
      }
      else if (seconds < (60*60*24)) {
        dateFormat = "h'h' m'm' s's'";
      }
      else {
        dateFormat = "d'd' h'h' m'm'";
      }
      /* eslint-enable quotes */

      return $filter('date')(date, dateFormat);
    };
  });
