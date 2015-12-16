var should = require('chai').should(),
    expect = require('chai').expect;

var ArrayCompiler = require('../src/array');

describe('Array compiler', function () {
  it('should replace array', function (done) {
    var data = {
      foo: [
        ['foo', 'bar'],
        ['bar', 'foo']
      ]
    };

    expect(ArrayCompiler.compile('[[foo]]', data)).to.eql([
      ['foo', 'bar'],
      ['bar', 'foo']
    ]);
    done();
  });

  it('should compile array with some attributes', function (done) {
    var data = {
      foo: [
        {foo: 'bar_foo', bar: 'foo_bar'},
        {foo: 'bar_bar', bar: 'foo_foo'}
      ]
    };

    expect(ArrayCompiler.compile({'[[foo]]': ['foo']}, data)).to.eql([
      ['bar_foo'],
      ['bar_bar']
    ]);
    done();
  });

  it('should compile with an array of objects', function (done) {
    var data = {
      foo: [
        {foo: 'foo_foo', bar: {foo: 'bar_foo'}},
        {foo: 'foo_bar', bar: {foo: 'bar_bar'}}
      ]
    };
    var template = {
      '[[foo]]': ['foo', {fieldValue: 'bar.foo', fieldKey: 'text', customAttribute: 'customValue'}]
    };

    expect(ArrayCompiler.compile(template, data)).to.eql([
      ['foo_foo', {text: 'bar_foo', customAttribute: 'customValue'}],
      ['foo_bar', {text: 'bar_bar', customAttribute: 'customValue'}]
    ]);
    done();
  });

  it('should replace with an array', function (done) {
    var data = {
      foo: [
        {foo: 'foo_foo', bar: {foo: 'bar_foo'}},
        {foo: 'foo_bar', bar: {foo: 'bar_bar'}}
      ]
    };
    var template = [
      [
        {foo: 'bar'}, {bar: 'foo'}
      ],
      {
        '[[foo]]': ['foo', {fieldValue: 'bar.foo', fieldKey: 'text', customAttribute: 'customValue'}]
      }
    ];

    expect(ArrayCompiler.compileArray(template, data)).to.eql([
      [
        {foo: 'bar'}, {bar: 'foo'}
      ],
      ['foo_foo', {text: 'bar_foo', customAttribute: 'customValue'}],
      ['foo_bar', {text: 'bar_bar', customAttribute: 'customValue'}]
    ]);
    done();
  });
});