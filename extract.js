/**
 Convert a dotted path to a location inside an object.

 @private
 @example

 // returns xfoo
 extractValue('wow.it.works', {
    wow: {
      it: {
        works: 'xfoo'
      }
    }
  });

 // returns undefined
 extractValue('xfoo.bar', { nope: 1 });

 @param {String} path dotted to indicate levels in an object.
 @param {Object} view for the data.
 */
exports.extractValue = function (path, view) {
  // Short circuit for direct matches.
  if (view && view[path]) return view[path];

  var parts = path.split('.');

  while (
    // view should always be truthy as all objects are.
      view &&
        // must have a part in the dotted path
          (part = parts.shift())
      ) {
    view = (typeof view === 'object' && part in view) ?
        view[part] :
        undefined;
  }

  return view;
};