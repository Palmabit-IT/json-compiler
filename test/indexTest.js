var should = require('chai').should(),
    expect = require('chai').expect;

var Compiler = require('../index');

describe('Json-compiler', function () {
  var helpers = {
    calc: function () {
      return 1 + 2;
    },
    sum: function (a, b) {
      return parseInt(a) + parseInt(b);
    }
  };

  it('should replace strings', function (done) {
    var data = {
      foo: {
        bar: 'foo_bar'
      },
      bar: 'bar_bar'
    };
    var template = {
      'foo_{{foo.bar}}': {
        'bar_{{foo.bar}}': {
          foo: '{{bar}}',
          bar: 'bar_{{bar}}'
        }
      }
    };

    expect(Compiler.compile(template, data)).to.eql({
      foo_foo_bar: {
        bar_foo_bar: {
          foo: 'bar_bar',
          bar: 'bar_bar_bar'
        }
      }
    });
    done();
  });

  it('should compile data with helpers and functions', function (done) {
    var data = {
      foo: {
        bar: 'foo_bar'
      }
    };
    var template = {
      foo: '{{calc}}',
      bar: '{{foo.bar}}',
      sum: '{{#sum}}{{calc}},{{calc}}{{/sum}}'
    };

    expect(Compiler.compile(template, data, helpers)).to.eql({
      foo: '3',
      bar: 'foo_bar',
      sum: '6'
    });
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

    expect(Compiler.compile(template, data)).to.eql([
      [
        {foo: 'bar'}, {bar: 'foo'}
      ],
      ['foo_foo', {text: 'bar_foo', customAttribute: 'customValue'}],
      ['foo_bar', {text: 'bar_bar', customAttribute: 'customValue'}]
    ]);
    done();
  });
});