# JSON Compiler

Json-compiler can do replacements on your js and json objects and compile them like templates. It's inspired by [mustache](https://github.com/janl/mustache.js) and [json-templater](https://github.com/lightsofapollo/json-templater). It supports:

* string replacement
* object replacement
* array replacement
* replacement with functions
* helpers

## Installation

```
npm install json-compiler --save
```

## Usage

### String replacement

String replacement is made by using variables like ```{{foo}}```.

```javascript
var Compiler = require('json-compiler');

var data = {
    foo: 'bar',
    bar: {
        foo: 'bar_foo'
    }
};

var object = {
    'foo_{{foo}}': '{{bar.foo}}'
};

Compiler.compile(object, data, helpers);

// {foo_bar: 'bar_foo'}
```

### Helper functions

Helper functions are applied as ```{{func}}``` or ```{{#func}}```.

```javascript
var data = {};

var helpers: {
    calc: function () {
        return 1 + 2;
    },
    sum: function (a, b) {
        return parseInt(a) + parseInt(b);
    }
};

var object = {
    foo: '{{#sum}}{{calc}},{{calc}}{{/sum}}'
};

Compiler.compile(object, data, helpers);

// {foo: '6'}
```

### Array replacement (example 1)

Array replacement is made by using variables like ```[[foo]]```.

```javascript
var data = {
  foo: [
    {foo: 'foo_foo', bar: {foo: 'bar_foo', bar: '1'}},
    {foo: 'foo_bar', bar: {foo: 'bar_bar', bar: '2'}}
  ]
};

var helpers: {
    sum: function (a, b) {
        return parseInt(a) + parseInt(b);
    }
};

var object = {
  '[[foo]]': ['foo', {key1: '{{bar.foo}}', key2: '{{#sum}}{{bar.bar}},{{bar.bar}}{{/sum}}', key3: 'customValue'}]
};

Compiler.compile(object, data, helpers);

/*
[
  ['foo_foo', {key1: 'bar_foo', key2: 2, key3: 'customValue'}],
  ['foo_bar', {key1: 'bar_bar', key2: 4, key3: 'customValue'}]
]
*/

```

### Array replacement (example 2)

```javascript
var data = {
  foo: [
    ['foo', 'bar'],
    ['bar', 'foo']
  ]
};
var object = [
  '[[foo]]'
]

Compiler.compile(object, data);

/*
[
  ['foo', 'bar'],
  ['bar', 'foo']
]
*/

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
