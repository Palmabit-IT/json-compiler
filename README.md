# JSON Compiler

It's a simple way to do template replacements on your js and json objects.

## Installation

```
npm install json-compiler --save
```

## Usage

```javascript
var data = {
  foo: [
    {bar1: 'b1', bar2: 'b2', bar3: 'b3'},
    {bar1: 'b11', bar2: 'b22', bar3: 'b33'}
  ],
  bar: [foo, bar],
  val: 2,
  calc: function () {
    return 1 + 2;
  },
  sum: function (a, b) {
    return parseInt(a) + parseInt(b);
  }
}
```

### Array replacement (example 1)

```javascript
var Compiler = require('json-compiler');

var template = [
  {
    '{{foo}}': ['bar1', {fieldValue: 'bar3', fieldKey: 'text', style: 'customStyle'}]
  }
]

Compiler.compile(template, data);

/*
[
  ['b1', {text: 'b3', style: 'customStyle'}],
  ['b11', {text: 'b33', style: 'customStyle'}]
]
*/

```

### Array replacement (example 2)

```javascript
var Compiler = require('json-compiler');

var template = [
  '{{foo}}'
]

Compiler.compile(template, data);

/*
[
  [
    {bar1: 'b1', bar2: 'b2', bar3: 'b3'},
    {bar1: 'b11', bar2: 'b22', bar3: 'b33'}
  ]
]
*/

```

### Object replacement

```javascript
var Compiler = require('json-compiler');

var template = {
  bar: '{{foo}}'
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
  foo: '{{calc}}'
}

Compiler.compile(template, data);

/*
{
  foo: 2
}
*/

```

### Helper functions

```javascript
var Compiler = require('json-compiler');

var template = {
  foo: '{{#sum}}{{val}}, {{val}}{{/sum}}'
}

Compiler.compile(template, data);

/*
{
  foo: 4
}
*/

```

### Json-templater/string

The string submodule is a very simple mustache like variable replacement with no special features:

```js
var render = require('json-templater/string');
render('{{xfoo}} {{say.what}}', { xfoo: 'yep', say: { what: 'yep' } });
// yep yep
```

**Important:** numbers are converted to strings.

### Json-templater/object

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

# Licence

[See the MIT License](http://opensource.org/licenses/MIT)
