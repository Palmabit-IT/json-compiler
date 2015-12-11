exports.preCompile = function (data) {

  function toString (obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        switch (typeof obj[i]) {
          case 'object':
            toString(obj[i]);
            break;
          case 'number':
            obj[i] = String(obj[i]);
            break;
        }
      }
    }
  }

  toString(data)
  return data;
};