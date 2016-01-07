exports.preCompile = function (data) {
  function toString (obj, maxIteration) {
    if (!maxIteration) {
      return;
    }

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        switch (typeof obj[i]) {
          case 'object':
            toString(obj[i], --maxIteration);
            break;
          case 'number':
            obj[i] = String(obj[i]);
            break;
        }
      }
    }
  }

  toString(data, 1000);
  return data;
};