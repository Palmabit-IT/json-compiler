exports.preCompile = function (data) {

  function toString (obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (typeof obj[i] === 'object') {
          toString(obj[i]);
        } else {
          obj[i] = String(obj[i]);
        }
      }
    }

    return data;
  }

  return toString(data);
};