exports.preCompile = function (data) {

  function iterateObj (obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        switch (typeof obj[i]) {
          case 'object':
            iterateObj(obj[i]);
            break;
          case 'function':
            obj[i] = obj[i]();
            iterateObj(obj[i]);
            break;
        }
      }
    }
  }

  iterateObj(data)
  return data;
};