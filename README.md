# JSON Compiler

It's a simple way to do template replacements on your js and json objects.
It uses [json-templater](https://github.com/lightsofapollo/json-templater) library.

##Installation

```
npm install json-compiler --save
```

##Usage

```javascript
var data = {
  foo: {bar1: 'b1', bar2: 'b2', bar3: 'b3'},
  bar: [foo, bar],
  calc: function () {
    return 1 + 2;
  }
}
```

### Array replacement

```javascript
var Compiler = require('json-compiler');

var template = [
  {
    '[[foo]]': ['bar1', 'bar3']
  },
  '[[foo]]'
]

Compiler.compile(template, data);

/*
[
  {bar1: 'b1', bar3: 'b3'},
  {bar1: 'b1', bar2: 'b2', bar3: 'b3'}
]
*/

```

### Object replacement

```javascript
var Compiler = require('json-compiler');

var template = {
  bar: '[[foo]]'
}

Compiler.compile(template, data);

/*
{
  bar: {bar1: 'b1', bar2: 'b2', bar3: 'b3'}
}
*/

```

### Replacement with functions

```javascript
var Compiler = require('json-compiler');

var template = {
  foo: '[[calc]]'
}

Compiler.compile(template, data);

/*
{
  foo: 3
}
*/

```

### Json-templater/string

See [json-templater](https://github.com/lightsofapollo/json-templater) doc.
The string submodule is a very simple mustache like variable replacement with no special features:

```js
var render = require('json-templater/string');
render('{{xfoo}} {{say.what}}', { xfoo: 'yep', say: { what: 'yep' } });
// yep yep
```

### Json-templater/object

See [json-templater](https://github.com/lightsofapollo/json-templater) doc.
The much more interesting part of this module is the object sub-module which does a deep clone and runs strings through json-templater/string (including keys!)

`template.json:`
```json
{
  "magic_key_{{magic}}": {
    "key": "interpolation is nice {{value}}"
  }
}
```

```js
var object = require('json-templater/object');
object(
  require('./template.json'),
  { magic: 'key', value: 'value' }
);

// result

{
  magic_key_key: {
    key: 'interpolation is nice value'
  }
}

```

## Tests

Run tests locally with:

```
  npm test
```

## Author

Palmabit.com

#Licence

[See the MIT License](http://opensource.org/licenses/MIT)
